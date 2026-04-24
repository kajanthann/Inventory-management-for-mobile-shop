import React, { createContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [aToken, setAtoken] = useState(
    localStorage.getItem("aToken") || ""
  );

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [confirmData, setConfirmData] = useState(null);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const backendUrl = "http://localhost:5000";

  // ✅ MEMOIZED AXIOS
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: backendUrl,
      withCredentials: true,
    });

    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("aToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.atoken = token;
      }
      return config;
    });

    instance.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          toast.error("Session expired");
          localStorage.removeItem("aToken");
          setAtoken("");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get("/api/products/all");

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ THEME HANDLER
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        aToken,
        setAtoken,
        axiosInstance,
        fetchProducts,
        loading,
        setLoading,
        products,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;