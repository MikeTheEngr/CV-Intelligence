import { useState, useEffect } from "react";
import { theme, S } from "../components/theme";
import { cvAPI } from "../services/api";

export default function CoverLetterPage({ profile, prefilledJob }) {
  const [job, setJob]         = useState({ title: "", company: "", description: "" });
  const [letter, setLetter]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    if (prefilledJob) { setJob({ title: prefilledJob.title || "", company: prefilledJob.company || "", description: prefilledJob.description || "" }); setLetter(""); }
  }, [prefilledJob]);

  const generate = async () => {
    setLoading(true); setError(""); setLetter("");
    try { const res = await cvAPI.coverLetter(profile, job); setLetter(res.cover_letter); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(letter); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div>
      <div className="glass-card" style={S.glass()}>
        <span style={S.cardTitle}>Generate Cover Letter</span>
        <p style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "24px", lineHeight: 1.6 }}>
          Fill in the job details. AI will craft a tailored cover letter using your CV profile.
        </p>

        {[["Job Title", "title", "e.g. Backend Engineer", "input"], ["Company", "company", "e.g. Stripe", "input"], ["Job Description", "description", "Paste key parts of the job description...", "textarea"]].map(([label, key, ph, type]) => (
          <div key={key} style={{ marginBottom: "16px" }}>
            <label style={S.label}>{label}</label>
            {type === "textarea"
              ? <textarea style={{ ...S.input, height: "100px", resize: "vertical" }} value={job[key]} placeholder={ph} onChange={(e) => setJob((p) => ({ ...p, [key]: e.target.value }))} />
              : <input style={S.input} value={job[key]} placeholder={ph} onChange={(e) => setJob((p) => ({ ...p, [key]: e.target.value }))} />
            }
          </div>
        ))}

        {error && <div style={S.error}>{error}</div>}

        <button className="btn-primary" style={S.btn("primary")} onClick={generate} disabled={loading || !job.title || !job.company}>
          {loading ? "Generating..." : "⚡ Generate Cover Letter"}
        </button>
      </div>

      {letter && (
        <div className="glass-card" style={S.glass()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <span style={S.cardTitle}>Your Cover Letter</span>
            <button className="btn-ghost" style={S.btn("ghost", "sm")} onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px", padding: "24px", fontSize: "14px", lineHeight: 1.85,
            color: theme.textMuted, whiteSpace: "pre-wrap", fontStyle: "normal",
          }}>{letter}</div>
        </div>
      )}
    </div>
  );
}