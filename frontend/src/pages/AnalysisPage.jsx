import { theme, S } from "../components/theme";
import CVScoreCard from "../components/CVScoreCard";
import SuggestionList from "../components/SuggestionList";

export default function AnalysisPage({ result }) {
  const { analysis, profile } = result;
  return (
    <div>
      <CVScoreCard analysis={analysis} />
      <SuggestionList suggestions={analysis.suggestions} />
      <div className="glass-card" style={S.glass()}>
        <span style={S.cardTitle}>Extracted Profile</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
          {[["Job Title", profile.job_title], ["Experience Level", profile.experience_level], ["Years of Experience", profile.years_of_experience], ["Education", profile.education_level], ["Location", profile.location], ["Languages", profile.languages?.join(", ")]].map(([k, v]) => (
            <div key={k} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "12px 14px" }}>
              <div style={{ fontSize: "10px", color: theme.textDim, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "5px", fontWeight: 600 }}>{k}</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{v || "—"}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: "10px", color: theme.textDim, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", fontWeight: 600 }}>Top Skills</div>
        {(profile.top_skills || []).map((s, i) => <span key={i} style={S.chip(theme.accent)}>{s}</span>)}
        {profile.skills?.length > 0 && <>
          <div style={{ fontSize: "10px", color: theme.textDim, textTransform: "uppercase", letterSpacing: "1.5px", margin: "14px 0 10px", fontWeight: 600 }}>All Skills</div>
          {profile.skills.map((s, i) => <span key={i} style={S.chip(theme.textMuted)}>{s}</span>)}
        </>}
      </div>
    </div>
  );
}