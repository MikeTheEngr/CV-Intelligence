import { useState, useRef, useCallback } from "react";
import { theme } from "./theme";

export default function UploadZone({ onFile, file }) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = useCallback((f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx"].includes(ext)) { alert("Please upload a PDF or DOCX file."); return; }
    onFile(f);
  }, [onFile]);

  return (
    <div
      onClick={() => fileRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      style={{
        position: "relative", borderRadius: "24px", padding: "64px 32px",
        textAlign: "center", cursor: "pointer", overflow: "hidden",
        background: dragging ? "rgba(123,47,255,0.12)" : "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `2px dashed ${dragging ? "rgba(123,47,255,0.8)" : "rgba(255,255,255,0.18)"}`,
        transition: "all .3s cubic-bezier(.4,0,.2,1)",
        marginBottom: "28px",
        boxShadow: dragging ? "0 0 60px rgba(123,47,255,0.2) inset" : "none",
      }}
    >
      {/* Glow effect on drag */}
      {dragging && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(123,47,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />}

      {/* Icon */}
      <div style={{
        width: 72, height: 72, margin: "0 auto 24px",
        background: `linear-gradient(135deg, rgba(123,47,255,0.2), rgba(0,198,255,0.2))`,
        border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "32px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        transition: "transform .3s",
        transform: dragging ? "scale(1.1)" : "scale(1)",
      }}>📄</div>

      {file ? (
        <>
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px", color: "#fff" }}>{file.name}</div>
          <div style={{
            display: "inline-block", fontSize: "12px", fontWeight: 600,
            color: theme.success, background: "rgba(0,255,163,0.1)",
            border: "1px solid rgba(0,255,163,0.3)", padding: "4px 14px", borderRadius: "20px",
          }}>✓ Ready to analyze</div>
        </>
      ) : (
        <>
          <div style={{ fontSize: "22px", fontWeight: 700, marginBottom: "10px", color: "#fff", letterSpacing: "-0.3px" }}>
            {dragging ? "Release to upload" : "Drop your CV here"}
          </div>
          <div style={{ fontSize: "14px", color: theme.textMuted, marginBottom: "24px" }}>PDF or DOCX · Max 10MB</div>
          <button
            onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}
            style={{
              padding: "10px 24px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)",
              color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", transition: "all .2s",
            }}
          >Browse Files</button>
        </>
      )}
      <input ref={fileRef} type="file" accept=".pdf,.docx" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  );
}