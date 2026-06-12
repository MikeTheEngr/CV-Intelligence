import { useState } from "react";
import { theme, scoreColor, S } from "./theme";
import { jobsAPI } from "../services/api";

export default function JobCard({ job, token, onCoverLetter }) {
  const [saved, setSaved]   = useState(false);
  const [saving, setSaving] = useState(false);
  const sc = scoreColor(job.match_score);

  const handleSave = async () => {
    if (!token) { alert("Sign in to save jobs."); return; }
    setSaving(true);
    try {
      await jobsAPI.save(job);
      setSaved(true);
    } catch (e) {
      console.error("Save job error:", e);
      alert(`Could not save job: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card" style={{
      ...S.glass({ padding: "20px 22px", marginBottom: "12px", borderRadius: "16px" }),
      display: "flex", gap: "18px",
    }}>
      {/* Match badge */}
      <div style={{
        flexShrink: 0, width: 58, height: 58, borderRadius: "14px",
        background: `${sc}12`, border: `1px solid ${sc}35`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 20px ${sc}20`,
      }}>
        <span style={{ fontSize: "18px", fontWeight: 800, color: sc, lineHeight: 1 }}>{job.match_score}</span>
        <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px", color: sc, marginTop: "2px", opacity: 0.8 }}>match</span>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px", color: "#fff", letterSpacing: "-0.2px" }}>{job.title}</div>
        <div style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "10px" }}>
          <span style={{ fontWeight: 600, color: theme.textMuted }}>{job.company}</span>
          <span style={{ margin: "0 8px", opacity: 0.4 }}>·</span>
          {job.location}
          {job.source && (
            <span style={{ marginLeft: "10px", fontSize: "11px", fontWeight: 600, color: theme.accentPurple, background: "rgba(123,47,255,0.1)", padding: "2px 8px", borderRadius: "6px", border: "1px solid rgba(123,47,255,0.2)" }}>
              {job.source}
            </span>
          )}
          {job.salary_min && (
            <span style={{ marginLeft: "8px", color: theme.success, fontWeight: 600, fontSize: "12px", background: "rgba(0,255,163,0.08)", padding: "2px 10px", borderRadius: "20px", border: "1px solid rgba(0,255,163,0.2)" }}>
              ${(job.salary_min / 1000).toFixed(0)}k–${(job.salary_max / 1000).toFixed(0)}k
            </span>
          )}
        </div>

        {job.skill_gaps?.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontSize: "11px", color: theme.textDim, marginRight: "6px" }}>Skill gaps:</span>
            {job.skill_gaps.map((g, i) => <span key={i} style={S.chip(theme.warning)}>{g}</span>)}
          </div>
        )}

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ ...S.btn("success", "sm"), textDecoration: "none" }}>Apply →</a>
          <button className="btn-ghost" style={S.btn("ghost", "sm")} onClick={() => onCoverLetter(job)}>✉ Cover Letter</button>
          <button style={saved ? S.btn("success", "sm") : S.btn("ghost", "sm")} onClick={handleSave} disabled={saving || saved}>
            {saving ? "..." : saved ? "✓ Saved" : "⊕ Save"}
          </button>
        </div>
      </div>
    </div>
  );
}