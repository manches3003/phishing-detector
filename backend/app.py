from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import re
from features import extract_features
from model import load_model
import os

app = Flask(__name__)
CORS(app)  # Allow React frontend to call this API

# Load model once when server starts
print("Loading ML model...")
model = load_model()
print("Model ready!")

# ── Helpers ────────────────────────────────────────────────────

def get_risk_reasons(features_dict):
    """Returns human-readable reasons why a URL is risky."""
    reasons = []

    if features_dict["url_length"] > 75:
        reasons.append(f"URL is unusually long ({features_dict['url_length']} characters)")
    if features_dict["has_ip"]:
        reasons.append("URL uses an IP address instead of a domain name")
    if features_dict["at_count"] > 0:
        reasons.append("URL contains '@' symbol — common phishing trick")
    if features_dict["has_redirect"]:
        reasons.append("URL contains double '//' — possible redirect attack")
    if features_dict["suspicious_tld"]:
        reasons.append("URL uses a suspicious free/cheap domain extension")
    if features_dict["brand_in_url"]:
        reasons.append("URL mentions a well-known brand — possible impersonation")
    if features_dict["is_shortened"]:
        reasons.append("URL is shortened — hides the real destination")
    if features_dict["has_port"]:
        reasons.append("URL specifies an unusual port number")
    if features_dict["subdomain_count"] > 2:
        reasons.append(f"URL has {features_dict['subdomain_count']} subdomains — suspicious nesting")
    if features_dict["suspicious_keywords"] >= 2:
        reasons.append("URL contains multiple security-related keywords (login, verify, secure)")
    if features_dict["mixed_domain"] :
        reasons.append("Domain mixes letters and numbers — common in fake domains")
    if not features_dict["has_https"]:
        reasons.append("URL uses HTTP (not HTTPS) — connection is not encrypted")
    if features_dict["hyphen_count"] > 3:
        reasons.append(f"Domain has {features_dict['hyphen_count']} hyphens — often used in fake domains")

    return reasons


def get_safe_reasons(features_dict):
    """Returns human-readable reasons why a URL looks safe."""
    reasons = []
    if features_dict["has_https"]:
        reasons.append("URL uses HTTPS — encrypted connection")
    if features_dict["subdomain_count"] <= 1:
        reasons.append("Simple, clean domain structure")
    if features_dict["url_length"] < 60:
        reasons.append("URL length is normal")
    if not features_dict["has_ip"]:
        reasons.append("Uses a proper domain name, not an IP address")
    if not features_dict["suspicious_tld"]:
        reasons.append("Uses a standard, trusted domain extension")
    return reasons


def get_verdict(probability):
    """Returns verdict label and color based on phishing probability."""
    if probability >= 0.75:
        return "DANGEROUS", "#ff4444"
    elif probability >= 0.45:
        return "SUSPICIOUS", "#ff9900"
    else:
        return "SAFE", "#00e676"


# ── Routes ─────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Phishing Detector API is running ✅"})


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data or "url" not in data:
        return jsonify({"error": "No URL provided"}), 400

    url = data["url"].strip()

    # Basic URL validation
    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    url_pattern = re.compile(
        r"^(https?://)?"
        r"(([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,})"
        r"(/[^\s]*)?$"
    )
    if not url_pattern.match(url):
        return jsonify({"error": "Invalid URL format"}), 400

    # Extract features
    features_dict, feature_values, feature_names = extract_features(url)

    # Predict
    feature_array = np.array(feature_values).reshape(1, -1)
    prediction = model.predict(feature_array)[0]
    probability = model.predict_proba(feature_array)[0][1]  # phishing probability

    verdict, color = get_verdict(probability)
    risk_reasons = get_risk_reasons(features_dict)
    safe_reasons = get_safe_reasons(features_dict)

    # Feature importance (for display)
    feature_importance = []
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
        for name, value, importance in zip(feature_names, feature_values, importances):
            feature_importance.append({
                "name": name.replace("_", " ").title(),
                "value": value,
                "importance": round(float(importance), 3)
            })
        feature_importance.sort(key=lambda x: x["importance"], reverse=True)

    return jsonify({
        "url": url,
        "verdict": verdict,
        "color": color,
        "phishing_probability": round(float(probability) * 100, 1),
        "safe_probability": round((1 - float(probability)) * 100, 1),
        "is_phishing": bool(prediction == 1),
        "risk_reasons": risk_reasons,
        "safe_reasons": safe_reasons,
        "top_features": feature_importance[:8],
        "features": features_dict
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
