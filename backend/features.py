import re
import urllib.parse

def extract_features(url):
    """
    Extracts 20+ features from a URL for phishing detection.
    Returns a dictionary of features.
    """
    features = {}

    # ── Basic parsing ──────────────────────────────────────────
    try:
        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc.lower()
        path   = parsed.path.lower()
        query  = parsed.query.lower()
    except Exception:
        domain = ""
        path   = ""
        query  = ""

    # ── 1. URL Length (phishing URLs tend to be long) ──────────
    features["url_length"] = len(url)

    # ── 2. Domain Length ───────────────────────────────────────
    features["domain_length"] = len(domain)

    # ── 3. Number of dots in domain ────────────────────────────
    features["dot_count"] = domain.count(".")

    # ── 4. Number of hyphens ───────────────────────────────────
    features["hyphen_count"] = url.count("-")

    # ── 5. Number of @ symbols (very suspicious) ───────────────
    features["at_count"] = url.count("@")

    # ── 6. Number of subdomains ────────────────────────────────
    parts = domain.split(".")
    features["subdomain_count"] = max(0, len(parts) - 2)

    # ── 7. Has HTTPS ───────────────────────────────────────────
    features["has_https"] = 1 if url.startswith("https") else 0

    # ── 8. Has IP address instead of domain ────────────────────
    ip_pattern = re.compile(r"(\d{1,3}\.){3}\d{1,3}")
    features["has_ip"] = 1 if ip_pattern.search(domain) else 0

    # ── 9. Number of digits in domain ──────────────────────────
    features["digit_count"] = sum(c.isdigit() for c in domain)

    # ── 10. Number of special characters ───────────────────────
    features["special_char_count"] = len(re.findall(r"[!#$%^&*(),?\":{}|<>]", url))

    # ── 11. URL contains redirect "//" ─────────────────────────
    features["has_redirect"] = 1 if url.count("//") > 1 else 0

    # ── 12. Suspicious TLD (top-level domain) ──────────────────
    suspicious_tlds = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz",
                       ".top", ".click", ".link", ".win", ".loan"]
    features["suspicious_tld"] = 1 if any(domain.endswith(t) for t in suspicious_tlds) else 0

    # ── 13. Contains brand name impersonation ──────────────────
    brands = ["paypal", "google", "amazon", "apple", "microsoft",
              "facebook", "netflix", "instagram", "twitter", "bank",
              "secure", "login", "verify", "update", "account"]
    features["brand_in_url"] = 1 if any(b in url.lower() for b in brands) else 0

    # ── 14. Path length ────────────────────────────────────────
    features["path_length"] = len(path)

    # ── 15. Number of query parameters ─────────────────────────
    features["query_param_count"] = len(urllib.parse.parse_qs(query))

    # ── 16. Has port number ────────────────────────────────────
    features["has_port"] = 1 if ":" in domain else 0

    # ── 17. Shortened URL service ──────────────────────────────
    shorteners = ["bit.ly", "tinyurl", "t.co", "goo.gl", "ow.ly",
                  "is.gd", "buff.ly", "adf.ly", "short.link"]
    features["is_shortened"] = 1 if any(s in domain for s in shorteners) else 0

    # ── 18. Excessive subfolders in path ───────────────────────
    features["path_depth"] = path.count("/")

    # ── 19. Has suspicious keywords in path ────────────────────
    suspicious_words = ["login", "signin", "verify", "secure", "account",
                        "update", "confirm", "banking", "password", "credential"]
    features["suspicious_keywords"] = sum(1 for w in suspicious_words if w in url.lower())

    # ── 20. Domain has numbers mixed with letters ───────────────
    features["mixed_domain"] = 1 if re.search(r"[a-z]\d|\d[a-z]", domain) else 0

    # ── Return as ordered list for ML model ────────────────────
    feature_order = [
        "url_length", "domain_length", "dot_count", "hyphen_count",
        "at_count", "subdomain_count", "has_https", "has_ip",
        "digit_count", "special_char_count", "has_redirect",
        "suspicious_tld", "brand_in_url", "path_length",
        "query_param_count", "has_port", "is_shortened",
        "path_depth", "suspicious_keywords", "mixed_domain"
    ]

    return features, [features[f] for f in feature_order], feature_order
