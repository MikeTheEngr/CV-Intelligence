import { useState } from "react";
import { theme, S } from "../components/theme";
import { cvAPI } from "../services/api";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "Netherlands", "Singapore", "UAE", "South Africa", "Nigeria", "India", "France",
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{
      ...S.btn("ghost", "sm"),
      fontSize: "11px", padding: "5px 12px", borderRadius: "8px",
    }}>{copied ? "✓ Copied" : "Copy"}</button>
  );
}

function Section({ title, accent = theme.accent, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: accent, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default function TailorPage({ profile }) {
  const [targetJob, setTargetJob]         = useState("");
  const [targetCountry, setTargetCountry] = useState("United States");
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [result, setResult]               = useState(null);

  const generate = async () => {
    if (!targetJob.trim()) { setError("Please enter a target job title."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await cvAPI.tailorCV(profile, targetJob, targetCountry);
      if (res.error) throw new Error(res.error);
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Input card */}
      <div className="glass-card" style={S.glass()}>
        <span style={S.cardTitle}>Tailor Your CV</span>
        <p style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "24px", lineHeight: 1.6 }}>
          Tell us your target role and market. AI will rewrite your CV summary, recommend skills, and give you targeted bullet improvements.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
          <div>
            <label style={S.label}>Target Job Title</label>
            <input
              style={S.input}
              value={targetJob}
              placeholder="e.g. Senior Backend Engineer"
              onChange={(e) => setTargetJob(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
            />
          </div>
          <div>
            <label style={S.label}>Target Country / Market</label>
            <select
              style={{ ...S.input, cursor: "pointer" }}
              value={targetCountry}
              onChange={(e) => setTargetCountry(e.target.value)}
            >
              {COUNTRIES.map((c) => <option key={c} value={c} style={{ background: "#0E0E1A" }}>{c}</option>)}
            </select>
          </div>
        </div>

        {error && <div style={S.error}>{error}</div>}

        <button
          className="btn-primary"
          style={S.btn("primary")}
          onClick={generate}
          disabled={loading}
        >
          {loading ? "Tailoring your CV..." : "✦ Tailor My CV"}
        </button>
      </div>

      {/* Results */}
      {loading && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div style={{ display: "inline-block", width: 36, height: 36, border: `3px solid rgba(255,255,255,0.1)`, borderTopColor: theme.accent, borderRadius: "50%", animation: "spin .8s linear infinite", marginBottom: "16px" }} />
          <div style={{ fontSize: "15px", color: theme.textMuted }}>AI is tailoring your CV for {targetCountry}...</div>
          <div style={{ fontSize: "13px", color: theme.textDim, marginTop: "6px" }}>Analyzing market requirements and rewriting content</div>
        </div>
      )}

      {result && (
        <div>
          {/* Tailored Summary */}
          <div className="glass-card" style={S.glass()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={S.cardTitle}>✦ Tailored Summary</span>
              <CopyBtn text={result.summary} />
            </div>
            <div style={{
              background: "rgba(0,198,255,0.05)", border: "1px solid rgba(0,198,255,0.15)",
              borderLeft: `3px solid ${theme.accent}`, borderRadius: "12px",
              padding: "18px", fontSize: "14px", color: theme.text, lineHeight: 1.8,
            }}>
              {result.summary}
            </div>
          </div>

          {/* Skills */}
          <div className="glass-card" style={S.glass()}>
            <span style={S.cardTitle}>✦ Skills Recommendations</span>
            <Section title="Must-Have Skills" accent={theme.success}>
              <div>{(result.skills?.must_have || []).map((s, i) => <span key={i} style={S.chip(theme.success)}>{s}</span>)}</div>
            </Section>
            <Section title="Nice to Have" accent={theme.accent}>
              <div>{(result.skills?.nice_to_have || []).map((s, i) => <span key={i} style={S.chip(theme.accent)}>{s}</span>)}</div>
            </Section>
            {result.skills?.remove?.length > 0 && (
              <Section title="Consider Removing" accent={theme.danger}>
                <div>{result.skills.remove.map((s, i) => <span key={i} style={S.chip(theme.danger)}>{s}</span>)}</div>
              </Section>
            )}
          </div>

          {/* Bullet improvements */}
          <div className="glass-card" style={S.glass()}>
            <span style={S.cardTitle}>✦ Bullet Point Improvements</span>
            <p style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "18px" }}>Replace generic bullets with these targeted, quantified versions.</p>
            {(result.bullet_improvements || []).map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px", marginBottom: "10px" }}>
                <div style={{ fontSize: "12px", color: theme.danger, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Before</div>
                <div style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "12px", lineHeight: 1.5 }}>{item.original}</div>
                <div style={{ fontSize: "12px", color: theme.success, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>After</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ fontSize: "13px", color: theme.text, lineHeight: 1.6, flex: 1, paddingLeft: "10px", borderLeft: `2px solid ${theme.success}` }}>{item.improved}</div>
                  <CopyBtn text={item.improved} />
                </div>
              </div>
            ))}
          </div>

          {/* ATS Keywords */}
          <div className="glass-card" style={S.glass()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={S.cardTitle}>✦ ATS Keywords to Add</span>
              <CopyBtn text={(result.keywords_to_add || []).join(", ")} />
            </div>
            <p style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "14px" }}>Add these keywords naturally into your CV to pass ATS filters for {targetCountry} job boards.</p>
            <div>{(result.keywords_to_add || []).map((k, i) => <span key={i} style={S.chip(theme.accentPurple)}>{k}</span>)}</div>
          </div>

          {/* Market Tips */}
          <div className="glass-card" style={S.glass()}>
            <span style={S.cardTitle}>✦ {targetCountry} Market Tips</span>
            {(result.market_tips || []).map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "flex-start" }}>
                <div style={{ width: 24, height: 24, borderRadius: "6px", background: `rgba(123,47,255,0.15)`, border: `1px solid rgba(123,47,255,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: theme.accentPurple, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: "13px", color: theme.textMuted, lineHeight: 1.6, paddingTop: "2px" }}>{tip}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}