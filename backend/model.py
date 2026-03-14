import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from features import extract_features

# ── Sample training data ───────────────────────────────────────
# In a real project you'd use a large dataset like:
# https://www.kaggle.com/datasets/eswarchandt/phishing-website-detector
# For now we use a built-in representative dataset

SAMPLE_URLS = [
    # (url, label)  0 = safe, 1 = phishing
    # --- SAFE URLs ---
    ("https://www.google.com", 0),
    ("https://www.github.com/login", 0),
    ("https://stackoverflow.com/questions", 0),
    ("https://www.amazon.com/products", 0),
    ("https://www.microsoft.com/en-us", 0),
    ("https://www.youtube.com/watch?v=abc123", 0),
    ("https://www.linkedin.com/in/profile", 0),
    ("https://www.reddit.com/r/python", 0),
    ("https://www.wikipedia.org/wiki/Phishing", 0),
    ("https://www.apple.com/iphone", 0),
    ("https://www.netflix.com/browse", 0),
    ("https://www.twitter.com/home", 0),
    ("https://www.instagram.com/explore", 0),
    ("https://www.facebook.com/marketplace", 0),
    ("https://www.paypal.com/signin", 0),
    ("https://docs.python.org/3/library", 0),
    ("https://www.bbc.com/news/technology", 0),
    ("https://www.nytimes.com/section/technology", 0),
    ("https://www.coursera.org/courses", 0),
    ("https://www.udemy.com/courses", 0),
    ("https://www.shopify.com/blog", 0),
    ("https://www.dropbox.com/home", 0),
    ("https://www.spotify.com/de/account", 0),
    ("https://www.airbnb.com/rooms", 0),
    ("https://www.booking.com/hotels", 0),

    # --- PHISHING URLs ---
    ("http://paypal-secure-login.tk/verify/account", 1),
    ("http://192.168.1.1/login/bank/verify", 1),
    ("http://google.com.evil-domain.com/signin", 1),
    ("http://amazon-update-account.ml/login?redirect=true", 1),
    ("http://bit.ly/secure-bank-login", 1),
    ("http://apple-id-verify.xyz/update/credentials", 1),
    ("http://secure-paypal.login.verify.tk/account", 1),
    ("http://microsoft-account-update.click/signin?user=admin", 1),
    ("http://netflix-billing-update.ga/payment/confirm", 1),
    ("http://www.faceb00k-login.ml/signin", 1),
    ("http://instagram-verify-account.top/login", 1),
    ("http://bankofamerica-secure.xyz/verify/identity", 1),
    ("http://amazon.com.fake-shop.ml/products/login", 1),
    ("http://tinyurl.com/fake-bank-login", 1),
    ("http://update-your-account-now.click/banking/credentials", 1),
    ("http://secure-login-verify.win/paypal/account/update", 1),
    ("http://192.168.0.254/phishing/bank/login.php", 1),
    ("http://apple-support-verify-now.loan/id/confirm", 1),
    ("http://google-account-recovery.gq/signin?next=/recovery", 1),
    ("http://microsoft365-login-secure.xyz/office/verify", 1),
    ("http://www.pay-pal-account-suspended.tk/reactivate", 1),
    ("http://chase-bank-verify-login.ml/secure/account", 1),
    ("http://verify-dropbox-account.cf/login?redirect=1", 1),
    ("http://spotify-premium-free.top/account/verify", 1),
    ("http://secure.amazon-billing.update.xyz/payment", 1),
]


def build_dataset():
    X, y = [], []
    for url, label in SAMPLE_URLS:
        _, feature_values, _ = extract_features(url)
        X.append(feature_values)
        y.append(label)
    return np.array(X), np.array(y)


def train_model():
    print("Building dataset...")
    X, y = build_dataset()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {acc * 100:.1f}%")
    print(classification_report(y_test, y_pred, target_names=["Safe", "Phishing"]))

    # Save model
    joblib.dump(model, "phishing_model.pkl")
    print("Model saved as phishing_model.pkl")
    return model


def load_model():
    if not os.path.exists("phishing_model.pkl"):
        print("No model found — training now...")
        return train_model()
    return joblib.load("phishing_model.pkl")


if __name__ == "__main__":
    train_model()
