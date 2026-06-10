import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ─── Axios instance ───────────────────────────────────────────────────────────
const client = axios.create({ baseURL: BASE });

// Attach token from localStorage on every request if present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("cv_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap axios errors into readable messages
const handle = async (fn) => {
  try {
    const res = await fn();
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.detail || err.message || "Request failed";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  signup:         (email, password) => handle(() => client.post("/auth/signup",          { email, password })),
  login:          (email, password) => handle(() => client.post("/auth/login",           { email, password })),
  me:             ()                => handle(() => client.get("/auth/me")),
  forgotPassword: (email)           => handle(() => client.post("/auth/forgot-password", { email })),
  updatePassword: (password)        => handle(() => client.post("/auth/update-password", { password })),
};

// ─── CV ───────────────────────────────────────────────────────────────────────
export const cvAPI = {
  analyze: (file) => {
    const form = new FormData();
    form.append("file", file);
    const token = localStorage.getItem("cv_token");
    return handle(() => client.post("/cv/analyze", form, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }));
  },
  history:      ()                                      => handle(() => client.get("/cv/history")),
  coverLetter:  (profile, job)                          => handle(() => client.post("/cv/cover-letter", { profile, job })),
  tailorCV:     (profile, target_job, target_country)   => handle(() => client.post("/cv/tailor", { profile, target_job, target_country })),
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const jobsAPI = {
  match:     (profile, country = "us", location = null) =>
    handle(() => client.post("/jobs/match", { profile, country, location })),
  save:      (job)  => handle(() => client.post("/jobs/save", { job })),
  getSaved:  ()     => handle(() => client.get("/jobs/saved")),
};