import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "bypass-tunnel-reminder": "true",
  },
});

// Add a request interceptor for debugging
axiosInstance.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL}${config.url}`;
  console.log(`[Axios Request] ${config.method?.toUpperCase()} ${fullUrl}`);
  return config;
});

// Add a response interceptor to handle 401s
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("[Axios Response] 401 Unauthorized - redirecting or clearing auth might be needed");
      // You can add logic here to redirect to login if needed
    }
    return Promise.reject(error);
  }
);
