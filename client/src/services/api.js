import axios from "axios";

const api = axios.create({
  baseURL: "/api",
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
