import axios from "axios";
import { logoutToLogin } from "../utils/auth";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Add token to requests automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized) - redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logoutToLogin();
    }
    return Promise.reject(error);
  }
);

export default API;