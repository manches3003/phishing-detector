import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API = "https://phishguard-api-puve.onrender.com";

const GaugeChart = ({ percentage, color }) => {
  const radius = 54;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <svg width="140" height="80" viewBox="0 0 140 80">
      <path d={`M 16 72 A ${radius} ${radius} 0 0 1 124 72`}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
      <motion.path d={`M 16 72 A ${radius} ${radius} 0 0 1 124 72`}
        fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
      <text x="70" y="66" textAnchor="middle" fill={color}
        fontSize="20" fontWeight="700" fontFamily="JetBrains Mono, monospace">{percentage}%</text>
    </svg>
  );
};

const FeatureBar = ({ name, importance, index }) => (
  <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }} style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: "#9b93b8", fontFamily: "JetBrains Mono, monospace" }}>{name}</span>
      <span style={{ fontSize: 11, color: "#7c5cfc", fontFamily: "JetBrains Mono, monospace" }}>{Math.round(importance * 100)}%</span>
    </div>
    <div style={{ height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(importance * 400, 100)}%` }}
        transition={{ duration: 1, delay: index * 0.05 }}
        style={{ height: "100%", background: "linear-gradient(90deg,#7c5cfc,#fc5c7d)", borderRadius: 2 }} />
    </div>
  </motion.div>
);

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await axios.post(`${API}/predict`, { url: url.trim() });
      setResult(res.data);
      setHistory(prev => [{ url: url.trim(), verdict: res.data.verdict, color: res.data.color, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 7)]);
    } catch (err) {
      setError(err.response?.data?.error || "Cannot connect to backend. Make sure Flask is running on port 5000.");
    } finally { setLoading(false); }
  };

  const verdictBg = result ? { "SAFE": "rgba(0,230,118,0.04)", "SUSPICIOUS": "rgba(255,153,0,0.04)", "DANGEROUS": "rgba(255,68,68,0.04)" }[result.verdict] : "";

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", color: "#f0ecff", fontFamily: "'Cabinet Grotesk', sans-serif", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Cabinet+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Grid bg */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(124,92,252,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(124,92,252,0.025) 1px,transparent 1px)",
        backgroundSize: "52px 52px" }} />
      <div style={{ position: "fixed", top: "15%", left: "5%", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(124,92,252,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "20%", right: "5%", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(252,92,125,0.05) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* ── NAVBAR ── */}
      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(4,4,10,0.94)", backdropFilter: "blur(24px)",
          padding: "0 48px", display: "flex", alignItems: "center", height: 62, gap: 14 }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#7c5cfc,#fc5c7d)",
          borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>🛡️</div>
        <div>
          <div style={{ fontFamily: "Syne,sans-serif", fontSize: 16, fontWeight: 800, lineHeight: 1.1,
            background: "linear-gradient(135deg,#7c5cfc,#fc5c7d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PhishGuard</div>
          <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: "#534f6a", letterSpacing: "0.1em" }}>ML-POWERED URL ANALYZER</div>
        </div>
        <div style={{ display: "flex", gap: 28, marginLeft: 40 }}>
          {[["20+","Features"],["RF","Model"],["~1s","Speed"]].map(([n,l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Syne,sans-serif", fontSize: 13, fontWeight: 700,
                background: "linear-gradient(135deg,#7c5cfc,#5cf0fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{n}</div>
              <div style={{ fontSize: 9, color: "#534f6a", fontFamily: "JetBrains Mono,monospace" }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 7,
          background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.2)", padding: "5px 14px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e676", boxShadow: "0 0 8px #00e676" }} />
          <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "#00e676", letterSpacing: "0.1em" }}>API ONLINE</span>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <div style={{ position: "relative", zIndex: 1, padding: "60px 48px 44px" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ textAlign: "center", maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 22,
            background: "rgba(124,92,252,0.08)", border: "1px solid rgba(124,92,252,0.2)", padding: "6px 18px" }}>
            <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "#7c5cfc", letterSpacing: "0.15em" }}>
              🔐 CYBER SECURITY TOOL
            </span>
          </div>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(28px,4vw,52px)",
            fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
            Detect Phishing URLs{" "}
            <span style={{ background: "linear-gradient(135deg,#7c5cfc,#fc5c7d,#5cf0fc)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              with Machine Learning
            </span>
          </h1>
          <p style={{ fontSize: 15, color: "#9b93b8", maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.8 }}>
            Paste any URL to instantly analyze it using a Random Forest ML model trained on 20+ security features. Get a verdict in under 1 second.
          </p>

          {/* URL Input */}
          <div style={{ display: "flex", maxWidth: 820, margin: "0 auto",
            border: "1px solid rgba(124,92,252,0.3)", background: "#0d0d18",
            boxShadow: "0 0 48px rgba(124,92,252,0.08)" }}>
            <span style={{ padding: "0 16px", display: "flex", alignItems: "center", color: "#534f6a", fontSize: 15, flexShrink: 0 }}>🔗</span>
            <input value={url} onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && analyze()}
              placeholder="https://example.com — paste any URL here..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none",
                padding: "15px 8px", color: "#f0ecff", fontFamily: "JetBrains Mono,monospace", fontSize: 12, minWidth: 0 }} />
            <motion.button onClick={analyze} disabled={loading || !url.trim()}
              whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "15px 36px", background: "linear-gradient(135deg,#7c5cfc,#fc5c7d)",
                border: "none", color: "#fff", fontFamily: "JetBrains Mono,monospace",
                fontSize: 12, letterSpacing: "0.06em", cursor: "pointer",
                opacity: !url.trim() ? 0.4 : 1, whiteSpace: "nowrap", flexShrink: 0 }}>
              {loading ? "Analyzing..." : "Analyze →"}
            </motion.button>
          </div>

          {/* Sample URLs */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }}>
            <span style={{ fontSize: 10, color: "#534f6a", fontFamily: "JetBrains Mono,monospace", alignSelf: "center" }}>TRY:</span>
            {["https://google.com", "http://paypal-secure-login.tk/verify", "http://bit.ly/bank-login"].map(s => (
              <button key={s} onClick={() => setUrl(s)}
                style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "#9b93b8",
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  padding: "4px 12px", cursor: "pointer" }}>
                {s.length > 30 ? s.slice(0, 30) + "..." : s}
              </button>
            ))}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ marginTop: 14, color: "#ff4444", fontFamily: "JetBrains Mono,monospace",
                fontSize: 11, background: "rgba(255,68,68,0.07)", border: "1px solid rgba(255,68,68,0.2)",
                padding: "10px 18px", display: "inline-block" }}>⚠ {error}</motion.div>
          )}
        </motion.div>
      </div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: "center", padding: "28px", position: "relative", zIndex: 1 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ width: 38, height: 38, border: "3px solid rgba(124,92,252,0.15)",
                borderTop: "3px solid #7c5cfc", borderRadius: "50%", margin: "0 auto 12px" }} />
            <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "#534f6a", letterSpacing: "0.12em" }}>
              EXTRACTING FEATURES · RUNNING ML MODEL...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RESULTS ── */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "relative", zIndex: 1, padding: "0 48px 64px" }}>

            {/* Verdict Banner */}
            <div style={{ background: verdictBg, border: `1px solid ${result.color}22`,
              padding: "36px 44px", marginBottom: 14,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 28, boxShadow: `0 0 80px ${result.color}08` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <div style={{ width: 60, height: 60, background: `${result.color}12`,
                  border: `1px solid ${result.color}28`, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                  {result.verdict === "SAFE" ? "✅" : result.verdict === "DANGEROUS" ? "🚨" : "⚠️"}
                </div>
                <div>
                  <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: "#534f6a", letterSpacing: "0.15em", marginBottom: 5 }}>VERDICT</div>
                  <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                    style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(26px,3.5vw,42px)",
                      fontWeight: 800, color: result.color, letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {result.verdict}
                  </motion.div>
                  <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "#534f6a", marginTop: 7,
                    wordBreak: "break-all", maxWidth: 480 }}>{result.url}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: "#534f6a", letterSpacing: "0.1em", marginBottom: 4 }}>PHISHING RISK</div>
                  <GaugeChart percentage={result.phishing_probability} color={result.color} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: "#534f6a", letterSpacing: "0.1em", marginBottom: 4 }}>SAFE SCORE</div>
                  <GaugeChart percentage={result.safe_probability} color="#00e676" />
                </div>
              </div>
            </div>

            {/* 3 columns */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 14 }}>
              <div style={{ background: "#090912", border: "1px solid rgba(255,68,68,0.13)", padding: "26px" }}>
                <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: "#ff4444", letterSpacing: "0.15em", marginBottom: 16 }}>⚠ RISK INDICATORS</div>
                {result.risk_reasons.length === 0
                  ? <div style={{ color: "#534f6a", fontSize: 13 }}>No risk indicators found</div>
                  : result.risk_reasons.map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                      style={{ display: "flex", gap: 8, marginBottom: 9, alignItems: "flex-start" }}>
                      <span style={{ color: "#ff4444", flexShrink: 0, fontSize: 11 }}>▹</span>
                      <span style={{ fontSize: 12, color: "#9b93b8", lineHeight: 1.6 }}>{r}</span>
                    </motion.div>
                  ))}
              </div>
              <div style={{ background: "#090912", border: "1px solid rgba(0,230,118,0.13)", padding: "26px" }}>
                <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: "#00e676", letterSpacing: "0.15em", marginBottom: 16 }}>✓ SAFE SIGNALS</div>
                {result.safe_reasons.length === 0
                  ? <div style={{ color: "#534f6a", fontSize: 13 }}>No safe signals detected</div>
                  : result.safe_reasons.map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                      style={{ display: "flex", gap: 8, marginBottom: 9, alignItems: "flex-start" }}>
                      <span style={{ color: "#00e676", flexShrink: 0, fontSize: 11 }}>✓</span>
                      <span style={{ fontSize: 12, color: "#9b93b8", lineHeight: 1.6 }}>{r}</span>
                    </motion.div>
                  ))}
              </div>
              <div style={{ background: "#090912", border: "1px solid rgba(124,92,252,0.13)", padding: "26px" }}>
                <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: "#7c5cfc", letterSpacing: "0.15em", marginBottom: 16 }}>📊 ML FEATURE WEIGHTS</div>
                {result.top_features?.slice(0, 7).map((f, i) => <FeatureBar key={f.name} {...f} index={i} />)}
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div style={{ background: "#090912", border: "1px solid rgba(255,255,255,0.05)", padding: "22px 26px" }}>
                <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: "#534f6a", letterSpacing: "0.15em", marginBottom: 14 }}>🕐 SCAN HISTORY</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 8 }}>
                  {history.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10,
                      background: "rgba(255,255,255,0.02)", padding: "9px 14px", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ color: item.color, fontFamily: "JetBrains Mono,monospace", fontSize: 10, fontWeight: 700, flexShrink: 0, minWidth: 72 }}>{item.verdict}</span>
                      <span style={{ fontSize: 11, color: "#9b93b8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.url}</span>
                      <span style={{ fontSize: 10, color: "#534f6a", fontFamily: "JetBrains Mono,monospace", flexShrink: 0 }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      {!result && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ position: "relative", zIndex: 1, margin: "0 48px 56px",
            display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            border: "1px solid rgba(255,255,255,0.05)", background: "#090912" }}>
          {[["🔍","20+","URL Features"],["🤖","Random Forest","ML Algorithm"],["🎯","~95%","Accuracy"],["⚡","< 1s","Speed"]].map(([icon,n,l], i) => (
            <div key={l} style={{ padding: "28px 20px", textAlign: "center",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "Syne,sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 5,
                background: "linear-gradient(135deg,#7c5cfc,#5cf0fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{n}</div>
              <div style={{ fontSize: 11, color: "#534f6a" }}>{l}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "0 0 28px", position: "relative", zIndex: 1 }}>
        <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "#534f6a", letterSpacing: "0.08em" }}>
          Built by{" "}
          <span style={{ background: "linear-gradient(135deg,#7c5cfc,#fc5c7d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>
            Keshav Kansara
          </span>
          {" "}
        </span>
      </div>

      <style>{`
        * { box-sizing: border-box; }
body { margin: 0; background: #04040a; }
input::placeholder { color: #3a3650; }
@keyframes blink {
  0%,100%{ opacity:1; } 50%{ opacity:0.4; }
}

/* ── TABLET (max 960px) ── */
@media(max-width:960px) {
  div[style*="grid-template-columns: repeat(3"] {
    grid-template-columns: 1fr !important;
  }
  div[style*="grid-template-columns: repeat(4"] {
    grid-template-columns: 1fr 1fr !important;
  }
}

/* ── MOBILE (max 640px) ── */
@media(max-width:640px) {
  /* Navbar */
  nav { padding: 0 16px !important; height: 54px !important; }
  nav > div:nth-child(3) { display: none !important; }
  nav > div:last-child { padding: 4px 10px !important; }
  nav > div:last-child span { font-size: 9px !important; }

  /* Hero section */
  div[style*="padding: \"60px 48px"] { padding: 36px 16px 28px !important; }
  div[style*="padding: \"0 48px"] { padding: 0 16px 40px !important; }
  div[style*="margin: \"0 48px"] { margin: 0 16px 40px !important; }

  /* Title */
  h1 { font-size: 26px !important; line-height: 1.2 !important; }

  /* Description text */
  p { font-size: 14px !important; }

  /* URL input — stack vertically */
  div[style*="display: \"flex\", maxWidth: \"820px\""] {
    flex-direction: column !important;
    max-width: 100% !important;
  }
  div[style*="display: \"flex\", maxWidth: \"820px\""] button {
    width: 100% !important;
    padding: 14px !important;
  }

  /* Sample URL buttons — stack */
  div[style*="display: \"flex\", gap: \"8px\", justifyContent: \"center\""] {
    flex-direction: column !important;
    align-items: center !important;
  }

  /* Results verdict banner */
  div[style*="display: \"flex\", alignItems: \"center\", justifyContent: \"space-between\""] {
    flex-direction: column !important;
    align-items: flex-start !important;
    padding: 24px 20px !important;
  }

  /* Stats grid — 1 column on very small */
  div[style*="grid-template-columns: repeat(4"] {
    grid-template-columns: 1fr 1fr !important;
  }

  /* 3 column results */
  div[style*="grid-template-columns: repeat(3"] {
    grid-template-columns: 1fr !important;
  }

  /* History grid */
  div[style*="grid-template-columns: repeat(auto-fill"] {
    grid-template-columns: 1fr !important;
  }
}

/* ── SMALL PHONES (max 380px) ── */
@media(max-width:380px) {
  h1 { font-size: 22px !important; }
  div[style*="grid-template-columns: repeat(4"] {
    grid-template-columns: 1fr !important;
  }
}
      `}</style>
    </div>
  );
}