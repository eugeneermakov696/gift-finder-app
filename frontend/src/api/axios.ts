import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const getBaseURL = (): string => {
  const url = import.meta.env.VITE_BACKEND_URL;

  if (!url || url.length === 0) {
    throw new Error("Error at the axios.ts: The VITE_BACKEND_URL was not provided");
  }

  return url;
};

const baseURL = getBaseURL();

const axiosInstance = axios.create({
  baseURL,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  withCredentials: true,
});

// Dedicated client for token refreshing to avoid interceptor recursion
const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _isRetry?: boolean };

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      originalRequest.url?.includes("auth/login/") ||
      originalRequest.url?.includes("auth/refresh/") ||
      originalRequest.url?.includes("auth/register/") ||
      originalRequest.url?.includes("auth/logout/");

    const hasSession = localStorage.getItem("has_session") === "true";

    if (
      error.response.status === 401 &&
      !originalRequest._isRetry &&
      !isAuthEndpoint &&
      hasSession
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance.request(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._isRetry = true;
      isRefreshing = true;

      try {
        await refreshClient.post("auth/refresh/");
        processQueue(null);
        return axiosInstance.request(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("has_session");
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response.status === 403) {
      console.error("403 Forbidden: Access denied. Redirecting to home...");
      window.location.replace('/');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;