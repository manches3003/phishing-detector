# 🛡️ PhishGuard — ML-Powered Phishing URL Detector

<div align="center">

![PhishGuard Banner](https://img.shields.io/badge/PhishGuard-ML%20Security%20Tool-7c5cfc?style=for-the-badge&logo=shield&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-fc5c7d?style=for-the-badge&logo=vercel&logoColor=white)](https://your-vercel-url.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-00e676?style=for-the-badge&logo=render&logoColor=white)](https://phishguard-api-puve.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/manches3003/phishing-detector)

**Detect phishing URLs instantly using Machine Learning**

[🌐 Live Demo](https://your-vercel-url.vercel.app) · [⚙️ API Docs](#api) · [🚀 Quick Start](#quick-start)

</div>

---

## 📸 Preview

> A cybersecurity tool that analyzes any URL for phishing patterns using a Random Forest ML model trained on 20+ security features.

---

## ✨ Features

- 🔍 **20+ URL Features** analyzed per scan
- 🤖 **Random Forest ML Model** for accurate predictions  
- ⚡ **Sub-second** analysis time
- 🟢 **SAFE** / 🟠 **SUSPICIOUS** / 🔴 **DANGEROUS** verdicts
- 📊 **Feature importance** visualization
- 🕐 **Scan history** tracking
- 📱 **Fully responsive** on all devices
- 🔄 **REST API** for integration

---

## 🛠️ Tech Stack

**Frontend**
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-FF0055?style=flat&logo=framer&logoColor=white)

**Backend**
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat&logo=flask&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.8-F7931E?style=flat&logo=scikit-learn&logoColor=white)

**Deployment**
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat&logo=render&logoColor=white)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v20+
- Python 3.11
- Git

### 1. Clone the repository
```bash
git clone https://github.com/manches3003/phishing-detector.git
cd phishing-detector
```

### 2. Start the Backend
```bash
cd backend
py -3.11 -m venv venv311
venv311\Scripts\activate
pip install -r requirements.txt
python model.py
python app.py
```
Backend runs at `http://localhost:5000`

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## 🔌 API

### Base URL
```
https://phishguard-api-puve.onrender.com
```

### Endpoints

#### `GET /`
Check if API is running
```json
{"status": "Phishing Detector API is running ✅"}
```

#### `GET /health`
Health check
```json
{"status": "ok", "model_loaded": true}
```

#### `POST /predict`
Analyze a URL for phishing

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "verdict": "SAFE",
  "color": "#00e676",
  "phishing_probability": 12.5,
  "safe_probability": 87.5,
  "is_phishing": false,
  "risk_reasons": [],
  "safe_reasons": ["URL uses HTTPS", "Simple domain structure"],
  "top_features": [...]
}
```

---

## 📁 Project Structure

```
phishing-detector/
├── backend/
│   ├── app.py              # Flask API
│   ├── features.py         # URL feature extractor (20+ features)
│   ├── model.py            # Random Forest ML model trainer
│   └── requirements.txt    # Python dependencies
└── frontend/
    ├── src/
    │   └── App.jsx         # React UI
    ├── package.json
    └── vite.config.js
```

---

## 🧪 Test URLs

| URL | Expected Result |
|-----|----------------|
| `https://google.com` | ✅ SAFE |
| `https://github.com` | ✅ SAFE |
| `http://paypal-secure-login.tk/verify` | 🔴 DANGEROUS |
| `http://bit.ly/bank-login` | 🟠 SUSPICIOUS |
| `http://192.168.1.1/login/bank` | 🔴 DANGEROUS |

---

## 🔍 ML Features Analyzed

| Feature | Description |
|---------|-------------|
| URL Length | Phishing URLs tend to be longer |
| Has HTTPS | Secure connection check |
| IP Address | IP instead of domain = suspicious |
| Suspicious TLD | .tk, .ml, .xyz etc |
| Brand in URL | Paypal, Google, Amazon impersonation |
| Shortened URL | bit.ly, tinyurl hiding real destination |
| Subdomain Count | Excessive subdomains = suspicious |
| Special Characters | @, //, unusual symbols |
| Suspicious Keywords | login, verify, secure, update |
| Mixed Domain | Numbers mixed with letters |

---

## 👨‍💻 Author

**Keshav Virajbhai Kansara**

MSc Cyber Security — SRH University Leipzig, Germany

[![Email](https://img.shields.io/badge/Email-keshavkansara123%40gmail.com-D14836?style=flat&logo=gmail&logoColor=white)](mailto:keshavkansara123@gmail.com)
[![Instagram](https://img.shields.io/badge/Instagram-@__mythical.kev-E4405F?style=flat&logo=instagram&logoColor=white)](https://instagram.com/_mythical.kev)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
Built with ❤️ by Keshav Kansara · Leipzig, Germany 🇩🇪
</div>
