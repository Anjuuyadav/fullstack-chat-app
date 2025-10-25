import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api": "https://fullstack-chat-app-backend-z7v9.onrender.com/api",
  withCredentials: true,
});
