import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token talab qilmaydigan ochiq endpointlar
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/refresh"];

// Request interceptor — token qo'shish (auth route'lardan tashqari)
api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const isAuthRoute = AUTH_ROUTES.some((route) => config.url?.includes(route));
  if (isAuthRoute) return config;

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor — 401/403 bo'lsa login sahifasiga yuborish
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if ((status === 401 || status === 403) && typeof window !== "undefined") {
      const isLoginPage = window.location.pathname === "/login";
      const isAuthRoute = AUTH_ROUTES.some((route) =>
        error.config?.url?.includes(route)
      );

      // Login sahifasida yoki login so'rovida — redirect qilmaymiz
      if (!isLoginPage && !isAuthRoute) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;