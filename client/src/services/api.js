import axios from "axios";

// Production (Vercel): set VITE_API_URL to https://YOUR-RENDER.onrender.com/api
// Local dev: falls back to /api (Vite proxy → localhost:5000)
const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
export const API_ORIGIN = API_BASE.replace(/\/api$/, "") || "";

/** Resolve resume/upload paths against the API host in production */
export function assetUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return API_ORIGIN ? `${API_ORIGIN}${normalized}` : normalized;
}

const api = axios.create({
  baseURL: API_BASE,
});

// Attach token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("placement_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for catching 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear token if expired
      if (!window.location.pathname.includes("/login")) {
        // Optional auto-logout on invalid token
      }
    }
    return Promise.reject(error);
  }
);

export default api;
