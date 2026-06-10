import { useState } from "react";
import { theme, S } from "../components/theme";
import UploadZone from "../components/UploadZone";

const COUNTRIES = [
  ["us","🇺🇸 United States"],["gb","🇬🇧 United Kingdom"],["au","🇦🇺 Australia"],
  ["ca","🇨🇦 Canada"],["de","🇩🇪 Germany"],["in","🇮🇳 India"],
  ["za","🇿🇦 South Africa"],["nl","🇳🇱 Netherlands"],["sg","🇸🇬 Singapore"],
];

export default function UploadPage({ onAnalyze, token, onShowAuth }) {
  const [file, setFile]       = useState(null);
  const [country, setCountry] = useState("us");

  return (
    <div>
      <UploadZone file={file} onFile={setFile} />

      {file && (
        <div style={{ textAlign: "center", animation: "fade-up .4s ease both" }}>
          {/* Country selector */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "10px 16px", backdropFilter: "blur(10px)" }}>
            <span style={{ fontSize: "13px", color: theme.textMuted, fontWeight: 500 }}>Job market</span>
            <select
              style={{ ...S.input, width: "auto", padding: "6px 12px", background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {COUNTRIES.map(([v, l]) => <option key={v} value={v} style={{ background: "#0E0E1A" }}>{l}</option>)}
            </select>
          </div>

          <div>
            <button
              className="btn-primary"
              style={{ ...S.btn("primary", "lg"), fontSize: "16px", padding: "16px 48px", borderRadius: "14px", letterSpacing: "-0.2px" }}
              onClick={() => onAnalyze(file, country)}
            >
              ⚡ Analyze &amp; Match Jobs
            </button>
          </div>

          {!token && (
            <div style={{ fontSize: "13px", color: theme.textDim, marginTop: "16px" }}>
              <span style={{ color: theme.accent, cursor: "pointer", fontWeight: 600 }} onClick={onShowAuth}>Sign in</span> to save your results across sessions
            </div>
          )}
        </div>
      )}

      {/* Feature pills */}
      {!file && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
          {["AI CV Scoring", "Skill Gap Analysis", "Live Job Matching", "Cover Letter Gen"].map((f) => (
            <div key={f} style={{
              fontSize: "12px", fontWeight: 500, color: theme.textMuted,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              padding: "6px 14px", borderRadius: "20px",
            }}>✦ {f}</div>
          ))}
        </div>
      )}
    </div>
  );
}