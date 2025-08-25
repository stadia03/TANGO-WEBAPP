// axiosConfig.ts
import axios from "axios";
import { useUserStore } from "./store";

const api = axios.create();

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      useUserStore.getState().setAuth(false);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
