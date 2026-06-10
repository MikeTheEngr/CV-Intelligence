import { useState } from "react";
import { theme, S } from "./components/theme";
import AuthModal from "./components/AuthModal";
import UploadPage from "./pages/UploadPage";
import AnalysisPage from "./pages/AnalysisPage";
import JobsPage from "./pages/JobsPage";
import CoverLetterPage from "./pages/CoverLetterPage";
import ProfilePage from "./pages/ProfilePage";
import TailorPage from "./pages/TailorPage";
import { cvAPI, jobsAPI } from "./services/api";

function Orb({ style }) {
  return <div style={{ position: "fixed", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0, ...style }} />;
}

function Spinner() {
  return (
    <div style={{ display: "inline-block", width: 40, height: 40, borderRadius: "50%", border: `2px solid rgba(255,255,255,0.1)`, borderTopColor: theme.accent, animation: "spin .8s linear infinite" }} />
  );
}

function Navbar({ userEmail, onShowAuth, onLogout, onShowProfile }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "16px 32px",
      background: "rgba(6,8,24,0.7)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "10px",
          background: `linear-gradient(135deg, ${theme.accentPurple}, ${theme.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", boxShadow: `0 0 20px rgba(123,47,255,0.5)`,
        }}>🧠</div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "-0.3px" }}>CV Intelligence</div>
          <div style={{ fontSize: "10px", color: theme.textDim, letterSpacing: "1px", textTransform: "uppercase" }}>Powered by Groq + Adzuna</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {userEmail ? (
          <>
            <button onClick={onShowProfile} style={{
              display: "flex", alignItems: "center", gap: "8px", cursor: "pointer",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px", padding: "6px 14px 6px 8px", fontFamily: "inherit",
              transition: "all .2s",
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: "8px",
                background: `linear-gradient(135deg, ${theme.accentPurple}, ${theme.accent})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 800, color: "#fff",
              }}>{userEmail[0].toUpperCase()}</div>
              <span style={{ fontSize: "13px", color: theme.textMuted, fontWeight: 500 }}>{userEmail.split("@")[0]}</span>
            </button>
            <button className="btn-ghost" style={S.btn("ghost", "sm")} onClick={onLogout}>Sign Out</button>
          </>
        ) : (
          <button style={{ ...S.btn("ghost", "sm"), borderColor: "rgba(123,47,255,0.4)", color: theme.accent }} onClick={onShowAuth}>Sign In</button>
        )}
      </div>
    </nav>
  );
}

const TABS = [
  { key: "analysis", label: "Analysis",     icon: "📊" },
  { key: "jobs",     label: "Jobs",          icon: "💼" },
  { key: "tailor",   label: "Tailor CV",     icon: "✦"  },
  { key: "cover",    label: "Cover Letter",  icon: "✉"  },
];

export default function App() {
  const [stage, setStage]       = useState("upload");
  const [loadingMsg, setLoadingMsg] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError]       = useState("");
  const [fileName, setFileName] = useState("");
  const [cvResult, setCvResult] = useState(null);
  const [jobResult, setJobResult] = useState(null);
  const [activeTab, setActiveTab] = useState("analysis");
  const [coverLetterJob, setCoverLetterJob] = useState(null);
  const [token, setToken]       = useState(() => localStorage.getItem("cv_token") || "");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("cv_email") || "");
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleAuth = (res) => {
    setToken(res.access_token);
    setUserEmail(res.email);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("cv_token");
    localStorage.removeItem("cv_email");
    setToken(""); setUserEmail("");
  };

  const handleAnalyze = async (file, country) => {
    setStage("loading"); setError("");
    setFileName(file.name);
    try {
      setLoadingMsg("Parsing your CV..."); setLoadingStep(1);
      const cv = await cvAPI.analyze(file);
      setCvResult(cv);
      setLoadingMsg("Finding matching jobs..."); setLoadingStep(2);
      const jobs = await jobsAPI.match(cv.profile, country);
      setJobResult(jobs);
      setLoadingStep(3);
      setTimeout(() => { setStage("results"); setActiveTab("analysis"); }, 400);
    } catch (e) {
      setError(e.message); setStage("upload");
    }
  };

  const reset = () => {
    setStage("upload"); setCvResult(null); setJobResult(null);
    setError(""); setCoverLetterJob(null); setActiveTab("analysis");
  };

  const handleCoverLetter = (job) => {
    setCoverLetterJob(job);
    setActiveTab("cover");
  };

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 20% 20%, rgba(123,47,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 10%, rgba(0,198,255,0.10) 0%, transparent 40%), ${theme.bg}`, color: theme.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes pulse-glow { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes fade-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { from{background-position:-200% 0} to{background-position:200% 0} }
        .gradient-text {
          color: #ffffff;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea, input, select { font-family: inherit; }
        ::selection { background: rgba(123,47,255,0.4); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        input:focus, textarea:focus, select:focus { border-color: rgba(123,47,255,0.5) !important; box-shadow: 0 0 0 3px rgba(123,47,255,0.1); }
        .glass-card { transition: border-color .2s, transform .2s, box-shadow .2s; }
        .glass-card:hover { border-color: rgba(255,255,255,0.18) !important; box-shadow: 0 8px 40px rgba(0,0,0,0.3); }
        .tab-btn { position: relative; overflow: hidden; }
        .tab-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(123,47,255,0.2),rgba(0,198,255,0.2)); opacity:0; transition:opacity .2s; }
        .tab-btn:hover::after { opacity:1; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 0 40px rgba(123,47,255,0.6) !important; }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.25) !important; color: #fff !important; }
      `}</style>

      {/* Ambient orbs */}
      <Orb style={{ width: 700, height: 700, background: `radial-gradient(circle, rgba(123,47,255,0.35) 0%, transparent 65%)`, top: -250, left: -250 }} />
      <Orb style={{ width: 600, height: 600, background: `radial-gradient(circle, rgba(0,198,255,0.25) 0%, transparent 65%)`, top: 50, right: -200, animation: "float 8s ease-in-out infinite" }} />
      <Orb style={{ width: 500, height: 500, background: `radial-gradient(circle, rgba(255,45,175,0.20) 0%, transparent 65%)`, bottom: -100, left: "30%", animation: "float 10s ease-in-out infinite reverse" }} />
      <Orb style={{ width: 350, height: 350, background: `radial-gradient(circle, rgba(0,255,163,0.18) 0%, transparent 65%)`, bottom: 50, right: 0 }} />

      {/* Grid overlay */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar userEmail={userEmail} onShowAuth={() => setShowAuth(true)} onLogout={handleLogout} onShowProfile={() => setShowProfile(true)} />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />}
        {showProfile && <ProfilePage userEmail={userEmail} token={token} onClose={() => setShowProfile(false)} />}

        <div style={{ maxWidth: "980px", margin: "0 auto", padding: "48px 24px 100px" }}>

          {/* Hero header */}
          <div style={{ textAlign: "center", marginBottom: "56px", animation: "fade-up .6s ease both" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(123,47,255,0.12)", border: "1px solid rgba(123,47,255,0.3)",
              borderRadius: "20px", padding: "6px 16px", marginBottom: "24px",
              backdropFilter: "blur(10px)",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accentMint, boxShadow: `0 0 8px ${theme.accentMint}`, animation: "pulse-glow 2s ease infinite" }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: theme.accent, letterSpacing: "1px", textTransform: "uppercase" }}>AI-Powered Career Intelligence</span>
            </div>

            <h1 className="gradient-text" style={{
              fontSize: "clamp(28px, 5vw, 64px)", fontWeight: 800,
              lineHeight: 1.05, letterSpacing: "-1.5px", marginBottom: "20px",
              whiteSpace: "nowrap",
            }}>
              Your CV, <span style={{ color: theme.accent }}>Reimagined.</span>
            </h1>

            <p style={{ fontSize: "17px", color: theme.textMuted, maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
              Upload your CV and watch AI turn it into career intelligence — scored, improved, and matched to real jobs in seconds.
            </p>
          </div>

          {/* UPLOAD */}
          {stage === "upload" && (
            <div style={{ animation: "fade-up .6s .1s ease both" }}>
              {error && <div style={S.error}>⚠ {error}</div>}
              <UploadPage onAnalyze={handleAnalyze} token={token} onShowAuth={() => setShowAuth(true)} />
            </div>
          )}

          {/* LOADING */}
          {stage === "loading" && (
            <div style={{ textAlign: "center", padding: "80px 0", animation: "fade-up .4s ease both" }}>
              <div style={{ marginBottom: "32px" }}>
                <Spinner />
              </div>
              <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>{loadingMsg}</div>
              <div style={{ fontSize: "13px", color: theme.textDim, marginBottom: "40px" }}>This usually takes 5–10 seconds</div>
              {/* Progress steps */}
              <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                {["Parse CV", "AI Analysis", "Match Jobs"].map((step, i) => (
                  <div key={i} style={{
                    padding: "8px 18px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                    background: loadingStep > i ? `linear-gradient(135deg, ${theme.accentPurple}, ${theme.accent})` : "rgba(255,255,255,0.05)",
                    color: loadingStep > i ? "#fff" : theme.textDim,
                    border: loadingStep > i ? "none" : "1px solid rgba(255,255,255,0.08)",
                    transition: "all .4s ease",
                    boxShadow: loadingStep > i ? `0 0 20px rgba(123,47,255,0.4)` : "none",
                  }}>{loadingStep > i ? "✓ " : ""}{step}</div>
                ))}
              </div>
            </div>
          )}

          {/* RESULTS */}
          {stage === "results" && cvResult && (
            <div style={{ animation: "fade-up .5s ease both" }}>
              {/* Results top bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.success, boxShadow: `0 0 10px ${theme.success}` }} />
                  <span style={{ fontSize: "14px", color: theme.textMuted }}>
                    Analysis complete · <span style={{ color: theme.text, fontWeight: 600 }}>{fileName}</span>
                  </span>
                </div>
                <button className="btn-ghost" style={S.btn("ghost", "sm")} onClick={reset}>↩ New CV</button>
              </div>

              {/* Tab bar */}
              <div style={{
                display: "flex", gap: "6px", marginBottom: "28px", padding: "6px",
                background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px",
              }}>
                {TABS.map((t) => (
                  <button key={t.key} className="tab-btn" style={{
                    flex: 1, padding: "11px", borderRadius: "11px", border: "none",
                    cursor: "pointer", fontSize: "13px", fontWeight: 600, transition: "all .25s",
                    background: activeTab === t.key
                      ? `linear-gradient(135deg, ${theme.accentPurple}, ${theme.accent})`
                      : "transparent",
                    color: activeTab === t.key ? "#fff" : theme.textMuted,
                    boxShadow: activeTab === t.key ? `0 0 20px rgba(123,47,255,0.35)` : "none",
                    fontFamily: "inherit",
                  }} onClick={() => setActiveTab(t.key)}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {activeTab === "analysis" && <AnalysisPage result={cvResult} />}
              {activeTab === "jobs" && <JobsPage jobResult={jobResult} token={token} onCoverLetter={handleCoverLetter} />}
              {activeTab === "tailor" && <TailorPage profile={cvResult.profile} />}
              {activeTab === "cover" && <CoverLetterPage profile={cvResult.profile} prefilledJob={coverLetterJob} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}