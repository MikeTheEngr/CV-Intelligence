export const theme = {
  // Glassmorphism core
  glass: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.12)",
  glassBorderHover: "rgba(255,255,255,0.25)",
  glassStrong: "rgba(255,255,255,0.10)",
  glassDark: "rgba(0,0,0,0.25)",

  // Background
  bg: "#060818",

  // Gradients
  grad1: "#7B2FFF",  // violet
  grad2: "#00C6FF",  // cyan
  grad3: "#FF2DAF",  // pink
  grad4: "#00FFA3",  // mint

  // Text
  text: "#F0F4FF",
  textMuted: "rgba(240,244,255,0.55)",
  textDim: "rgba(240,244,255,0.28)",

  // Accents
  accent: "#00C6FF",
  accentPurple: "#7B2FFF",
  accentPink: "#FF2DAF",
  accentMint: "#00FFA3",

  // Status
  success: "#00FFA3",
  warning: "#FFB547",
  danger: "#FF5757",

  // Blur
  blur: "blur(20px)",
  blurStrong: "blur(40px)",
};

export const scoreColor = (s) =>
  s >= 75 ? theme.success : s >= 50 ? theme.warning : theme.danger;

export const S = {
  glass: (extra = {}) => ({
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.13)",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "20px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
    ...extra,
  }),
  cardTitle: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    color: "#00C6FF",
    marginBottom: "20px",
    display: "block",
  },
  btn: (v = "primary", sz = "md") => ({
    display: "inline-flex", alignItems: "center", gap: "8px",
    cursor: "pointer", border: "none", transition: "all .25s cubic-bezier(.4,0,.2,1)",
    borderRadius: "12px", fontFamily: "inherit", fontWeight: 600,
    padding: sz === "sm" ? "8px 16px" : sz === "lg" ? "15px 36px" : "11px 24px",
    fontSize: sz === "sm" ? "13px" : sz === "lg" ? "15px" : "14px",
    ...(v === "primary" ? {
      background: `linear-gradient(135deg, ${theme.accentPurple}, ${theme.accent})`,
      color: "#fff",
      boxShadow: `0 0 30px rgba(123,47,255,0.4)`,
    } : v === "ghost" ? {
      background: theme.glass,
      backdropFilter: theme.blur,
      WebkitBackdropFilter: theme.blur,
      border: `1px solid ${theme.glassBorder}`,
      color: theme.textMuted,
    } : v === "success" ? {
      background: `rgba(0,255,163,0.12)`,
      border: `1px solid rgba(0,255,163,0.3)`,
      color: theme.success,
    } : v === "danger" ? {
      background: `rgba(255,87,87,0.12)`,
      border: `1px solid rgba(255,87,87,0.3)`,
      color: theme.danger,
    } : {
      background: theme.glass,
      border: `1px solid ${theme.glassBorder}`,
      color: theme.textMuted,
    }),
  }),
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "12px",
    padding: "12px 16px",
    color: theme.text,
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color .2s",
  },
  chip: (c) => ({
    display: "inline-block",
    background: `${c}15`,
    border: `1px solid ${c}35`,
    color: c,
    fontSize: "11px",
    fontWeight: 600,
    padding: "4px 11px",
    borderRadius: "8px",
    marginRight: "6px",
    marginBottom: "6px",
    letterSpacing: "0.3px",
  }),
  error: {
    background: "rgba(255,87,87,0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,87,87,0.3)",
    color: "#FF5757",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "13px",
    marginBottom: "16px",
  },
  label: {
    fontSize: "11px",
    color: theme.textDim,
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginBottom: "8px",
    display: "block",
    fontWeight: 600,
  },
};