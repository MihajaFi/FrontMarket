import axios from "axios";

const API_BASE_URL =
  (import.meta.env as Record<string, string>).VITE_API_URL || "/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// 🔑 Ajouter le token UNIQUEMENT pour routes protégées
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("mc_token");

  const publicEndpoints = [
    "/products",
    "/product",
    "/login",
    "/register",
    "/orders",
  ];

  const isPublic = publicEndpoints.some((path) =>
    config.url?.startsWith(path)
  );

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ⚠️ Redirection seulement si token expiré sur route protégée
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const token = localStorage.getItem("mc_token");
    const url = error.config?.url || "";

    const protectedEndpoints = ["/checkout", "/loyalty"];

    const isProtected = protectedEndpoints.some((p) =>
      url.includes(p)
    );

    if (status === 401 && token && isProtected) {
      localStorage.removeItem("mc_token");
      localStorage.removeItem("mc_user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;