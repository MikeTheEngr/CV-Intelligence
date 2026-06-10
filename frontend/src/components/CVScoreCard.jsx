import { theme, scoreColor, S } from "./theme";

const BREAKDOWN_LABELS = {
  clarity: "Clarity", ats_compatibility: "ATS Compatibility",
  keyword_density: "Keyword Density", structure: "Structure", impact: "Impact",
};

function ScoreRing({ score }) {
  const c = scoreColor(score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
      <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="65" cy="65" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="65" cy="65" r="45" fill="none" stroke={c} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 8px ${c})` }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "30px", fontWeight: 800, color: c, lineHeight: 1, letterSpacing: "-1px" }}>{score}</span>
        <span style={{ fontSize: "10px", color: theme.textDim, textTransform: "uppercase", letterSpacing: "1.5px", marginTop: "2px" }}>score</span>
      </div>
    </div>
  );
}

function Bar({ label, value }) {
  const c = scoreColor(value);
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", color: theme.textMuted, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: c }}>{value}</span>
      </div>
      <div style={{ height: "5px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: `linear-gradient(90deg, ${c}88, ${c})`, borderRadius: "3px", transition: "width .8s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 8px ${c}66` }} />
      </div>
    </div>
  );
}

export default function CVScoreCard({ analysis }) {
  return (
    <>
      <div className="glass-card" style={S.glass()}>
        <span style={S.cardTitle}>Overall Score</span>
        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <ScoreRing score={analysis.overall_score} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "14px", color: theme.textMuted, lineHeight: 1.75, marginBottom: "16px" }}>{analysis.summary}</p>
            <div>{(analysis.strengths || []).map((s, i) => <span key={i} style={S.chip(theme.success)}>✓ {s}</span>)}</div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={S.glass()}>
        <span style={S.cardTitle}>Score Breakdown</span>
        {Object.entries(analysis.breakdown || {}).map(([k, v]) => (
          <Bar key={k} label={BREAKDOWN_LABELS[k] || k} value={v} />
        ))}
      </div>
    </>
  );
}