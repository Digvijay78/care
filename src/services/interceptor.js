"use client";
import axios from "axios";
import { useRouter } from "next/router";

// Create an Axios instance with the base URL from environment variables
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DEFAULT_SERVER_BASE_URL,
});

// Request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure this runs only in the browser
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (typeof window !== "undefined" && error.response && error.response.status === 401) {
      // Remove token from localStorage
      localStorage.removeItem("token");

      // Use Next.js router to redirect to the login page
      const router = useRouter();
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
