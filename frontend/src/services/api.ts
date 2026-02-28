import axios from "axios";
import { tokenService } from "@/utils/tokenService";

type FailedQueueItem = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};
let onTokenRefresh: ((token: string) => void) | null = null;

export const setOnTokenRefresh = (callback: (token: string) => void) => {
  onTokenRefresh = callback;
};
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 300,
});

const excludedUrls = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/forgot-password",
  "/auth/verify-reset-token",
  "/auth/reset-password",
];
// Add token to requests
api.interceptors.request.use((config) => {
  const token = tokenService.getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Handle refresh logic safely (no Redux imports)
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("API Error from:", error.config?.url);
    const originalRequest = error.config;

    if (excludedUrls.some((url) => originalRequest.url.includes(url))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.put(
          "/auth/sessions/current",
          {},
          { withCredentials: true },
        );
        const newToken = data.accessToken;
        if (onTokenRefresh) {
          onTokenRefresh(newToken);
        }
        tokenService.setToken(newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenService.clearToken();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
