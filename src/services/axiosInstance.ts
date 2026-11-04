import axios from "axios";

// Determine the base URL.
// In local development (on localhost / 127.0.0.1 or DEV mode),
// we use the local Vite proxy "/api/" to completely bypass browser CORS restrictions.
const getBaseUrl = (): string => {
  if (
    (typeof import.meta !== "undefined" && import.meta.env?.DEV) ||
    (typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "0.0.0.0"))
  ) {
    return "/api/";
  }

  const raw =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
    (typeof import.meta !== "undefined" && import.meta.env?.NEXT_PUBLIC_API_URL) ||
    "https://server.boatridersports.in/api";

  const cleaned = raw.replace(/\/+$/, "");
  return `${cleaned}/`;
};

export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

// Add a request interceptor for auth token injection
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("access_token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add a response interceptor to handle 401s
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("[Axios Response] 401 Unauthorized - login session expired or required");
    }
    return Promise.reject(error);
  }
);
