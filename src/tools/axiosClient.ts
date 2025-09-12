/* eslint-disable */
import axios from "axios";

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "X-SUZUNE-TOKEN": process.env.NEXT_PUBLIC_SUZUNE_TOKEN || "",
  },
  withCredentials: true, // ✅ sends cookies automatically
  timeout: 10000,
});

// Silent refresh interval (refresh every 12 minutes)
if (typeof window !== "undefined") {
  setInterval(async () => {
    try {
      await api.post("/auth/refresh");
      console.log("Access token refreshed silently");
    } catch (err) {
      console.log("Silent refresh failed, redirecting to login");
      window.location.href = "/login";
    }
  }, 12 * 60 * 1000); // 12 minutes
}

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and refresh access token via cookie
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (!err.response) {
      console.error("Network error:", err.message);
      return Promise.reject(err);
    }

    if (
      err.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/signup")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh endpoint uses cookies automatically
        await api.post("/auth/refresh");

        processQueue(null);

        // Retry the original request
        return api(originalRequest);
      } catch (refreshErr: any) {
        processQueue(refreshErr);

        // Redirect to login if refresh fails
        if (typeof window !== "undefined" && !originalRequest._isBackgroundRequest) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Log server errors
    if (err.response.status >= 500) {
      console.error("Server error:", err.response.status);
    }

    return Promise.reject(err);
  }
);

export default api;
