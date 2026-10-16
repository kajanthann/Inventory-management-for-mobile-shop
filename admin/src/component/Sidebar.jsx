import React, { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/slogo.png";
import logo1 from "../assets/slogo1.png";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

import {
  FaTachometerAlt,
  FaBoxes,
  FaTimes,
  FaShoppingCart,
  FaTools,
  FaUserCircle,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaMoon,
  FaSun,
  FaTruck,
  FaCog,
  FaDatabase,
} from "react-icons/fa";

import ChangeDeletePassword from "./ChangeDeletePassword";

const SideBar = () => {
  const { theme, toggleTheme, setAtoken, axiosInstance } =
    useContext(AppContext);

  const navigate = useNavigate();

  const [lowStockItems, setLowStockItems] = useState([]);
  const [dbStats, setDbStats] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Inventory", icon: <FaBoxes />, path: "/inventory" },
    { name: "Sales", icon: <FaShoppingCart />, path: "/sales" },
    { name: "Repair", icon: <FaTools />, path: "/repair" },
    { name: "Pre-Order", icon: <FaTruck />, path: "/pre-order" },
    { name: "Reports", icon: <FaDatabase />, path: "/reports" },
    // { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  // Fetch low-stock products.
  const fetchLowStock = async () => {
    try {
      const { data } = await axiosInstance.get("/api/products/all");
      const products = data.products || [];
      setLowStockItems(products.filter((product) => product.qty <= 5));
    } catch (error) {
      console.error("Low stock fetch error:", error);
    }
  };

  // Fetch database storage statistics.
  const fetchDbStats = async (attempt = 1) => {
    try {
      const { data } = await axiosInstance.get("/api/db/stats");
      if (data) setDbStats(data);
    } catch (error) {
      if (attempt < 3) {
        setTimeout(() => fetchDbStats(attempt + 1), attempt * 800);
      } else {
        console.error("DB stats unavailable after retries:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchDbStats();
    fetchLowStock();

    const timer = setTimeout(() => fetchDbStats(), 300);
    return () => clearTimeout(timer);
  }, []);

  // Close the settings modal with Escape.
  useEffect(() => {
    if (!settingsOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSettingsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent the page behind the modal from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [settingsOpen]);

  // Logout.
  const performLogout = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      await axiosInstance.post("/api/admin/logout");

      localStorage.removeItem("aToken");
      setAtoken("");

      toast.dismiss(toastId);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Logout failed");
    }
  };

  // Confirm logout.
  const handleLogout = () => {
    toast.custom(
      (t) => (
        <div
          className={`w-[300px] rounded-lg border p-4 shadow-lg ${
            theme === "dark"
              ? "border-[#2a2a2a] bg-[#1a1a1a] text-white"
              : "border-gray-200 bg-white text-black"
          }`}
        >
          <p className="mb-3 text-sm font-medium">
            Are you sure you want to logout?
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className={`rounded px-3 py-1 text-xs ${
                theme === "dark"
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                performLogout();
              }}
              className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  /*
   * IMPORTANT:
   * Render the modal through createPortal into document.body.
   * This separates it from sidebar/page stacking contexts.
   */
  const settingsModal =
    settingsOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/70 p-4"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2147483647,
              isolation: "isolate",
              pointerEvents: "auto",
            }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSettingsOpen(false);
              }
            }}
            role="presentation"
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="settings-modal-title"
              className="relative flex max-h-[90dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-[#1f1f1f] dark:bg-[#111111]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="h-[3px] shrink-0" style={{ background: "#b00000" }} />

              <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-4 dark:border-[#1f1f1f] dark:bg-[#0d0d0d]">
                <div className="flex items-center gap-2">
                  <FaCog style={{ color: "#b00000" }} size={14} />
                  <h2
                    id="settings-modal-title"
                    className="text-sm font-bold text-gray-900 dark:text-white"
                  >
                    Settings
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label="Close settings"
                >
                  <FaTimes />
                </button>
              </header>

              <div className="min-h-0 overflow-y-auto p-5">
                <ChangeDeletePassword />
              </div>
            </section>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <aside
        className="relative z-10 flex h-screen w-16 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-[#2a2a2a] dark:bg-[#1a1a1a] sm:w-52"
      >
        {/* LOGO */}
        <div className="border-b border-gray-200 p-2 dark:border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <img
              src={theme === "dark" ? logo1 : logo}
              alt="SmartSpider logo"
              className={theme === "dark" ? "h-10 pl-2" : "h-14"}
            />

            {theme === "dark" && (
              <div className="hidden sm:block">
                <p className="text-xl font-extrabold text-white">SMART</p>
                <p className="-mt-2 text-lg font-bold text-red-500">SPIDER</p>
              </div>
            )}
          </div>
        </div>

        {/* MENU */}
        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mx-2 flex items-center gap-3 rounded-md px-4 py-3 ${
                  isActive
                    ? "border-l-4 border-red-500 bg-gray-200 text-black dark:bg-[#2a2a2a] dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#222]"
                }`
              }
            >
              {item.icon}
              <span className="hidden text-sm sm:block">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* DB STORAGE STATUS */}
        <div className="mb-3 hidden px-3 sm:block">
          {dbStats ? (
            <div className="rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-[#2a2a2a] dark:bg-black">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-green-600 dark:text-green-400">
                <FaDatabase /> DB Storage Usage
              </p>

              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-500">
                <div
                  className={`h-full transition-all duration-500 ${
                    dbStats.usagePercent < 60
                      ? "bg-green-500"
                      : dbStats.usagePercent < 80
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, Number(dbStats.usagePercent) || 0))}%`,
                  }}
                />
              </div>

              <div className="mt-2 text-[10px] text-gray-600 dark:text-gray-300">
                {dbStats.storageSizeMB} MB / {dbStats.limitMB} MB
                <br />
                {dbStats.usagePercent}% used
              </div>
            </div>
          ) : (
            <div className="animate-pulse rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-[#2a2a2a] dark:bg-black">
              <div className="mb-2 h-3 w-24 rounded bg-blue-200 dark:bg-gray-700" />
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600" />
              <div className="mt-2 h-2 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          )}
        </div>

        {/* LOW STOCK ALERT */}
        {lowStockItems.length > 0 && (
          <div className="mb-3 hidden px-3 sm:block">
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-[#2d1a00] dark:bg-black">
              <div className="mb-1 flex items-center gap-2">
                <FaExclamationTriangle className="text-xs text-yellow-500" />
                <span className="text-xs font-semibold text-yellow-600">
                  Low Stock Alert
                </span>
              </div>

              <p className="mb-2 text-[11px] text-gray-600 dark:text-gray-300">
                {lowStockItems.length} item
                {lowStockItems.length !== 1 ? "s" : ""} need restocking
              </p>

              <NavLink
                to="/inventory"
                className="text-xs font-medium text-red-600 hover:underline"
              >
                View items →
              </NavLink>
            </div>
          </div>
        )}

        {/* THEME */}
        <div className="mb-3 px-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
            <span className="hidden text-xs lg:block">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>

        {/* PROFILE / SETTINGS / LOGOUT */}
        <div className="mt-auto border-t border-gray-200 p-2 dark:border-[#2a2a2a] lg:p-3">
          <div className="flex items-center justify-center gap-2 md:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <FaUserCircle className="shrink-0 text-2xl text-gray-500" />

              <div className="hidden min-w-0 md:block">
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                  Admin
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="flex shrink-0 items-center justify-center rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-gray-400 dark:hover:bg-white/[0.04] dark:hover:text-white"
                aria-label="Open settings"
                title="Settings"
              >
                <FaCog size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="shrink-0 rounded p-2 text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Logout"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </aside>

      {/* Render modal outside the sidebar and page stacking contexts */}
      {settingsModal}
    </>
  );
};

export default SideBar;
