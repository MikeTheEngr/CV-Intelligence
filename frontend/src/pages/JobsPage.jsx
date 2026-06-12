import { useState, useEffect } from "react";
import { theme, S } from "../components/theme";
import JobCard from "../components/JobCard";
import { jobsAPI } from "../services/api";

function SavedJobs() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { jobsAPI.getSaved().then(setJobs).catch(console.error).finally(() => setLoading(false)); }, []);
  if (loading) return <div style={{ textAlign: "center", padding: "48px 0", color: theme.textMuted }}>Loading...</div>;
  if (!jobs.length) return <div style={{ textAlign: "center", padding: "48px 0", color: theme.textMuted }}>No saved jobs yet.</div>;
  return <div>{jobs.map((job) => (
    <div key={job.id} className="glass-card" style={{ ...S.glass({ padding: "18px 22px", marginBottom: "10px", borderRadius: "16px" }), display: "flex", gap: "16px" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{job.job_title}</div>
        <div style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "8px" }}>{job.company} · {job.location}{job.match_score && <span style={{ marginLeft: "10px", color: theme.accent, fontWeight: 600 }}>{job.match_score}% match</span>}</div>
        {job.job_url && <a href={job.job_url} target="_blank" rel="noopener noreferrer" style={{ ...S.btn("success", "sm"), textDecoration: "none", display: "inline-flex", marginTop: "4px" }}>Apply →</a>}
      </div>
    </div>
  ))}</div>;
}

export default function JobsPage({ jobResult, token, onCoverLetter }) {
  const [subTab, setSubTab] = useState("matched");
  const tabs = [{ key: "matched", label: `Matched (${jobResult?.jobs?.length || 0})` }, ...(token ? [{ key: "saved", label: "Saved" }] : [])];

  return (
    <div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {tabs.map((t) => (
          <button key={t.key} style={{
            padding: "8px 18px", borderRadius: "10px", border: "none", cursor: "pointer",
            fontSize: "13px", fontWeight: 600, fontFamily: "inherit", transition: "all .2s",
            background: subTab === t.key ? `linear-gradient(135deg, ${theme.accentPurple}, ${theme.accent})` : "rgba(255,255,255,0.05)",
            color: subTab === t.key ? "#fff" : theme.textMuted,
            boxShadow: subTab === t.key ? "0 0 20px rgba(123,47,255,0.3)" : "none",
          }} onClick={() => setSubTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {subTab === "matched" && jobResult && (
        <>
          <div style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span>{jobResult.jobs.length} jobs matched · <span style={{ color: theme.accent, fontWeight: 600 }}>{jobResult.keywords_used}</span></span>
            <div style={{ display: "flex", gap: "6px" }}>
              {["Adzuna", "JSearch", "Remotive", "LinkedIn", "Indeed", "Glassdoor"].map((src) => {
                const count = jobResult.jobs.filter(j => j.source === src).length;
                if (!count) return null;
                return <span key={src} style={{ fontSize: "11px", fontWeight: 600, color: theme.accentPurple, background: "rgba(123,47,255,0.1)", padding: "2px 8px", borderRadius: "6px", border: "1px solid rgba(123,47,255,0.2)" }}>{src} {count}</span>;
              })}
            </div>
          </div>
          {jobResult.jobs.length === 0
            ? <div style={{ textAlign: "center", padding: "48px 0", color: theme.textMuted }}>No jobs found. Try a different country.</div>
            : jobResult.jobs.map((job) => <JobCard key={job.id} job={job} token={token} onCoverLetter={onCoverLetter} />)
          }
        </>
      )}
      {subTab === "saved" && token && <SavedJobs />}
    </div>
  );
}