/* eslint-disable */
import axios from "axios";

let isRefreshing = false;
const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/v1";
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "X-SUZUNE-TOKEN": process.env.NEXT_PUBLIC_SUZUNE_TOKEN  || "",
  },
  withCredentials: true,
  timeout: 10000, // Add a 10-second timeout
});

// Request interceptor: add access token
api.interceptors.request.use(
  (config) => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: refresh token if expired
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Handle network errors
    if (!err.response) {
      console.error("Network error:", err.message);
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await api.post("/auth/refresh", {});
        const { accessToken } = refreshRes.data;

        // Store the new token
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
        }
        
        if (api.defaults.headers.common) {
          api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);

        // Retry the failed request
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshErr: any) {
        // Clear token and redirect to login if refresh fails
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
        
        // Only redirect if we're in the browser and it's not a background request
        if (typeof window !== "undefined" && !originalRequest._isBackgroundRequest) {
          window.location.href = "/login";
        }
        
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error statuses
    if (err.response?.status >= 500) {
      console.error("Server error:", err.response.status);
    }

    return Promise.reject(err);
  }
);

export default api;