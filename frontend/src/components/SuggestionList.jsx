import { theme, S } from "./theme";

export default function SuggestionList({ suggestions = [] }) {
  return (
    <div className="glass-card" style={S.glass()}>
      <span style={S.cardTitle}>Improvement Suggestions</span>
      {suggestions.map((s, i) => (
        <div key={i} style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "14px", padding: "16px 18px", marginBottom: "10px",
          transition: "border-color .2s, background .2s",
          borderLeft: `3px solid rgba(123,47,255,0.5)`,
        }}>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: theme.accentPurple, marginBottom: "6px" }}>{s.section}</div>
          <div style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "8px", lineHeight: 1.5 }}>{s.issue}</div>
          <div style={{ fontSize: "13px", color: theme.text, lineHeight: 1.6, paddingLeft: "12px", borderLeft: `2px solid ${theme.success}44` }}>
            <span style={{ color: theme.success, fontWeight: 600 }}>Fix: </span>{s.fix}
          </div>
        </div>
      ))}
    </div>
  );
}