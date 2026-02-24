import axios from "axios";

const API_BASE_URL =
  (import.meta.env as Record<string, string>).VITE_API_URL || "/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// 🔑 Ajouter le token pour tous les endpoints protégés
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("mc_token");

  // Liste des endpoints publics
  const publicEndpoints = [
    "/products",
    "/product",
    "/login",
    "/register",
    "/orders",
  ];

  // Si ce n'est pas un endpoint public, ajouter le token
  const isPublic = publicEndpoints.some((path) =>
    config.url?.startsWith(path)
  );

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ⚠️ Redirection si token expiré ou invalide
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const token = localStorage.getItem("mc_token");

    // Si 401 et qu'il y avait un token, redirection vers login
    if (status === 401 && token) {
      localStorage.removeItem("mc_token");
      localStorage.removeItem("mc_user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;