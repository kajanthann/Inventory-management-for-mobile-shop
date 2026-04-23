import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [aToken, setAtoken] = useState(localStorage.getItem("aToken") || "");
  const backendUrl = "http://localhost:5000";
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
  });

  // attach token dynamically
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("aToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.atoken = token; // 👈 important (backend fallback)
    }
    return config;
  });

  // handle 401
  axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401) {
        toast.error(error.response.data?.message || "Session expired");
        setAtoken("");
        localStorage.removeItem("aToken");
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

    // ── Fetch all products on mount ────────────────────────────────
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/api/products/all");
        if (data.success) {
          setProducts(data.products);
        } else {
          errorToast(data.message || "Failed to load products.");
        }
      } catch (err) {
        errorToast(err.response?.data?.message || "Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  useEffect(() => {
    const root = document.documentElement;
    theme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        aToken,
        setAtoken,
        backendUrl,
        axiosInstance,
        fetchProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;