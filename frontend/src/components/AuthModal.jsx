import { useState } from "react";
import { theme, S } from "./theme";
import { authAPI } from "../services/api";

// ─── Screens ──────────────────────────────────────────────────────────────────
const SCREENS = {
  LOGIN:         "login",
  SIGNUP:        "signup",
  FORGOT:        "forgot",
  FORGOT_SENT:   "forgot_sent",
  RESET:         "reset",
  RESET_SUCCESS: "reset_success",
};

// ─── Shared input block ───────────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, placeholder, onEnter }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={S.label}>{label}</label>
      <input
        style={S.input} type={type} value={value}
        placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
      />
    </div>
  );
}

// ─── Top gradient bar ─────────────────────────────────────────────────────────
function TopBar() {
  return (
    <div style={{
      height: 3, background: `linear-gradient(90deg, ${theme.accentPurple}, ${theme.accent}, ${theme.accentPink})`,
      margin: "-40px -40px 28px", borderRadius: "24px 24px 0 0",
    }} />
  );
}

// ─── Back link ────────────────────────────────────────────────────────────────
function Back({ onBack }) {
  return (
    <button onClick={onBack} style={{
      background: "none", border: "none", color: theme.textMuted,
      fontSize: "13px", cursor: "pointer", padding: 0,
      display: "flex", alignItems: "center", gap: "6px",
      marginBottom: "20px", fontFamily: "inherit",
    }}>← Back to sign in</button>
  );
}

// ─── Main modal ──────────────────────────────────────────────────────────────
export default function AuthModal({ onClose, onAuth }) {
  const [screen, setScreen]     = useState(SCREENS.LOGIN);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const clearError = () => setError("");
  const go = (s) => { setScreen(s); clearError(); };

  // ── Login ──
  const handleLogin = async () => {
    setLoading(true); clearError();
    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem("cv_token", res.access_token);
      localStorage.setItem("cv_email", res.email);
      onAuth(res);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  // ── Signup ──
  const handleSignup = async () => {
    setLoading(true); clearError();
    try {
      const res = await authAPI.signup(email, password);
      localStorage.setItem("cv_token", res.access_token);
      localStorage.setItem("cv_email", res.email);
      onAuth(res);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  // ── Forgot password ──
  const handleForgot = async () => {
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true); clearError();
    try {
      await authAPI.forgotPassword(email);
      go(SCREENS.FORGOT_SENT);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  // ── Reset password ──
  const handleReset = async () => {
    if (newPassword !== confirmPassword) { setError("Passwords don't match."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); clearError();
    try {
      await authAPI.updatePassword(newPassword);
      go(SCREENS.RESET_SUCCESS);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const modalBox = {
    width: "100%", maxWidth: "420px", margin: "16px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "24px", padding: "40px",
    boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
    animation: "fade-up .3s ease both",
  };

  const PrimaryBtn = ({ onClick, disabled, children }) => (
    <button className="btn-primary"
      style={{ ...S.btn("primary", "lg"), width: "100%", justifyContent: "center", borderRadius: "14px" }}
      onClick={onClick} disabled={disabled || loading}
    >{loading ? "Please wait..." : children}</button>
  );

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", background: "rgba(6,8,24,0.75)" }} onClick={onClose}>
      <div style={modalBox} onClick={(e) => e.stopPropagation()}>
        <TopBar />

        {/* ── LOGIN ── */}
        {screen === SCREENS.LOGIN && (
          <>
            <h2 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "6px" }}>Welcome back</h2>
            <p style={{ fontSize: "14px", color: theme.textMuted, marginBottom: "28px" }}>Sign in to access your saved analyses and jobs.</p>
            {error && <div style={S.error}>{error}</div>}
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" onEnter={handleLogin} />
            <div style={{ textAlign: "right", marginBottom: "20px", marginTop: "-8px" }}>
              <span style={{ fontSize: "13px", color: theme.accent, cursor: "pointer", fontWeight: 500 }} onClick={() => go(SCREENS.FORGOT)}>
                Forgot password?
              </span>
            </div>
            <PrimaryBtn onClick={handleLogin}>Sign In</PrimaryBtn>
            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: theme.textMuted }}>
              No account?{" "}
              <span style={{ color: theme.accent, cursor: "pointer", fontWeight: 600 }} onClick={() => go(SCREENS.SIGNUP)}>Sign up free</span>
            </div>
          </>
        )}

        {/* ── SIGNUP ── */}
        {screen === SCREENS.SIGNUP && (
          <>
            <h2 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "6px" }}>Get started</h2>
            <p style={{ fontSize: "14px", color: theme.textMuted, marginBottom: "28px" }}>Create an account to save your analyses and job matches.</p>
            {error && <div style={S.error}>{error}</div>}
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Min. 6 characters" onEnter={handleSignup} />
            <div style={{ marginBottom: "24px" }} />
            <PrimaryBtn onClick={handleSignup}>Create Account</PrimaryBtn>
            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: theme.textMuted }}>
              Already have one?{" "}
              <span style={{ color: theme.accent, cursor: "pointer", fontWeight: 600 }} onClick={() => go(SCREENS.LOGIN)}>Sign in</span>
            </div>
          </>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {screen === SCREENS.FORGOT && (
          <>
            <Back onBack={() => go(SCREENS.LOGIN)} />
            <h2 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "6px" }}>Reset password</h2>
            <p style={{ fontSize: "14px", color: theme.textMuted, marginBottom: "28px" }}>
              Enter your email and we'll send you a link to reset your password.
            </p>
            {error && <div style={S.error}>{error}</div>}
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" onEnter={handleForgot} />
            <div style={{ marginBottom: "24px" }} />
            <PrimaryBtn onClick={handleForgot}>Send Reset Link</PrimaryBtn>
          </>
        )}

        {/* ── FORGOT SENT ── */}
        {screen === SCREENS.FORGOT_SENT && (
          <>
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
                background: "rgba(0,255,163,0.1)", border: "1px solid rgba(0,255,163,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px",
              }}>📧</div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "12px" }}>Check your email</h2>
              <p style={{ fontSize: "14px", color: theme.textMuted, lineHeight: 1.7, marginBottom: "28px" }}>
                We sent a password reset link to<br />
                <span style={{ color: theme.text, fontWeight: 600 }}>{email}</span>
              </p>
              <p style={{ fontSize: "12px", color: theme.textDim, marginBottom: "24px" }}>
                Didn't receive it? Check your spam folder or{" "}
                <span style={{ color: theme.accent, cursor: "pointer" }} onClick={() => go(SCREENS.FORGOT)}>try again.</span>
              </p>
              <button className="btn-ghost" style={{ ...S.btn("ghost", "sm"), width: "100%", justifyContent: "center" }} onClick={() => go(SCREENS.LOGIN)}>
                Back to Sign In
              </button>
            </div>
          </>
        )}

        {/* ── RESET PASSWORD (user lands from email link) ── */}
        {screen === SCREENS.RESET && (
          <>
            <h2 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "6px" }}>New password</h2>
            <p style={{ fontSize: "14px", color: theme.textMuted, marginBottom: "28px" }}>Choose a strong password for your account.</p>
            {error && <div style={S.error}>{error}</div>}
            <Field label="New Password" type="password" value={newPassword} onChange={setNewPassword} placeholder="Min. 6 characters" />
            <Field label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat password" onEnter={handleReset} />
            <div style={{ marginBottom: "8px" }} />
            <PrimaryBtn onClick={handleReset}>Update Password</PrimaryBtn>
          </>
        )}

        {/* ── RESET SUCCESS ── */}
        {screen === SCREENS.RESET_SUCCESS && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
              background: "rgba(0,255,163,0.1)", border: "1px solid rgba(0,255,163,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px",
            }}>✓</div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "12px" }}>Password updated!</h2>
            <p style={{ fontSize: "14px", color: theme.textMuted, marginBottom: "28px" }}>Your password has been successfully updated. You can now sign in with your new password.</p>
            <button className="btn-primary" style={{ ...S.btn("primary", "lg"), width: "100%", justifyContent: "center", borderRadius: "14px" }} onClick={() => go(SCREENS.LOGIN)}>
              Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
}