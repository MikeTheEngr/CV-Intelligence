import { useState, useEffect } from "react";
import { theme, S } from "../components/theme";
import { authAPI, cvAPI, jobsAPI } from "../services/api";

const PLANS = {
  free: {
    name: "Free",
    color: theme.textMuted,
    bg: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.1)",
    limits: { analyses: 3, coverLetters: 1, jobMatches: 10 },
  },
  pro: {
    name: "Pro",
    color: theme.accentPurple,
    bg: "rgba(123,47,255,0.1)",
    border: "rgba(123,47,255,0.35)",
    limits: { analyses: 999, coverLetters: 999, jobMatches: 999 },
  },
};

function StatCard({ label, used, total, color }) {
  const pct = Math.min((used / total) * 100, 100);
  const isUnlimited = total >= 999;
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div style={{ fontSize: "13px", color: theme.textMuted, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: isUnlimited ? theme.success : color }}>
          {isUnlimited ? "∞ Unlimited" : `${used} / ${total}`}
        </div>
      </div>
      {!isUnlimited && (
        <div style={{ height: "5px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct >= 90 ? theme.danger : color, borderRadius: "3px", transition: "width .6s ease", boxShadow: `0 0 8px ${pct >= 90 ? theme.danger : color}66` }} />
        </div>
      )}
    </div>
  );
}

export default function ProfilePage({ userEmail, token, onClose }) {
  const [plan]       = useState("free"); // will come from DB once payment is wired
  const [usage, setUsage] = useState({ analyses: 0, coverLetters: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]   = useState("overview");

  const currentPlan = PLANS[plan];

  useEffect(() => {
    Promise.all([cvAPI.history()])
      .then(([hist]) => {
        setHistory(hist || []);
        setUsage({ analyses: hist?.length || 0, coverLetters: 0 });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { key: "overview",  label: "Overview" },
    { key: "history",   label: "CV History" },
    { key: "settings",  label: "Settings" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", background: "rgba(6,8,24,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: "620px", margin: "16px", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "24px", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column", animation: "fade-up .3s ease both" }} onClick={(e) => e.stopPropagation()}>

        {/* Top gradient bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${theme.accentPurple}, ${theme.accent}, ${theme.accentPink})`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: "28px 32px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {/* Avatar */}
              <div style={{
                width: 52, height: 52, borderRadius: "14px",
                background: `linear-gradient(135deg, ${theme.accentPurple}, ${theme.accent})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", fontWeight: 800, color: "#fff",
                boxShadow: `0 0 24px rgba(123,47,255,0.4)`,
              }}>
                {userEmail?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{userEmail}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: currentPlan.bg, border: `1px solid ${currentPlan.border}`, borderRadius: "20px", padding: "3px 12px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: currentPlan.color }} />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: currentPlan.color, letterSpacing: "0.5px" }}>{currentPlan.name} Plan</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: theme.textMuted, cursor: "pointer", padding: "6px 10px", fontSize: "16px", fontFamily: "inherit" }}>✕</button>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "4px" }}>
            {tabs.map((t) => (
              <button key={t.key} style={{
                flex: 1, padding: "8px", borderRadius: "8px", border: "none",
                cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "inherit",
                background: tab === t.key ? `linear-gradient(135deg, ${theme.accentPurple}, ${theme.accent})` : "transparent",
                color: tab === t.key ? "#fff" : theme.textMuted,
                transition: "all .2s",
                boxShadow: tab === t.key ? "0 0 16px rgba(123,47,255,0.3)" : "none",
              }} onClick={() => setTab(t.key)}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 32px 32px", overflowY: "auto", flex: 1 }}>

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div>
              {/* Usage this month */}
              <div style={{ fontSize: "11px", fontWeight: 700, color: theme.accent, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px" }}>
                Usage This Month
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                <StatCard label="CV Analyses" used={usage.analyses} total={currentPlan.limits.analyses} color={theme.accent} />
                <StatCard label="Cover Letters" used={usage.coverLetters} total={currentPlan.limits.coverLetters} color={theme.accentPurple} />
                <StatCard label="Job Matches" used={0} total={currentPlan.limits.jobMatches} color={theme.accentPink} />
                <StatCard label="Saved Jobs" used={0} total={currentPlan.limits.analyses} color={theme.success} />
              </div>

              {/* Upgrade CTA — only for free users */}
              {plan === "free" && (
                <div style={{
                  background: `linear-gradient(135deg, rgba(123,47,255,0.15), rgba(0,198,255,0.10))`,
                  border: "1px solid rgba(123,47,255,0.3)", borderRadius: "16px", padding: "22px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
                }}>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Upgrade to Pro</div>
                    <div style={{ fontSize: "13px", color: theme.textMuted, lineHeight: 1.5 }}>
                      Unlimited analyses, cover letters, and job matches.<br />
                      <span style={{ color: theme.accent, fontWeight: 600 }}>$9/month — cancel anytime.</span>
                    </div>
                  </div>
                  <button className="btn-primary" style={{ ...S.btn("primary"), borderRadius: "12px", whiteSpace: "nowrap", flexShrink: 0 }}>
                    ⚡ Upgrade Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── CV HISTORY ── */}
          {tab === "history" && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: theme.accent, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px" }}>Past Analyses</div>
              {loading && <div style={{ textAlign: "center", padding: "32px 0", color: theme.textMuted }}>Loading...</div>}
              {!loading && history.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0", color: theme.textMuted }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>📄</div>
                  No CV analyses yet. Upload your first CV to get started.
                </div>
              )}
              {history.map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 16px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "3px" }}>
                      {item.profile_json?.job_title || "CV Analysis"}
                    </div>
                    <div style={{ fontSize: "12px", color: theme.textDim }}>
                      {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                  <div style={{
                    fontSize: "18px", fontWeight: 800,
                    color: item.overall_score >= 75 ? theme.success : item.overall_score >= 50 ? theme.warning : theme.danger,
                    background: "rgba(255,255,255,0.05)", padding: "6px 14px", borderRadius: "10px",
                  }}>{item.overall_score}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === "settings" && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: theme.accent, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px" }}>Account</div>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", overflow: "hidden", marginBottom: "20px" }}>
                {[["Email", userEmail], ["Plan", currentPlan.name], ["Member since", "June 2026"]].map(([k, v], i, arr) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <span style={{ fontSize: "13px", color: theme.textMuted }}>{k}</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: "11px", fontWeight: 700, color: theme.accent, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px" }}>Danger Zone</div>
              <button style={{ ...S.btn("danger"), width: "100%", justifyContent: "center", borderRadius: "12px" }}>
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}