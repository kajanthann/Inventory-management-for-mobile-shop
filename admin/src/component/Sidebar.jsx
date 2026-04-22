import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/slogo.png";
import logo1 from "../assets/slogo1.png";
import { AppContext } from "../context/AppContext";

import {
  FaTachometerAlt,
  FaBoxes,
  FaShoppingCart,
  FaTools,
  FaUserCircle,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaMoon,
  FaSun,
} from "react-icons/fa";

const Sidebar = () => {
  const { theme, toggleTheme } = useContext(AppContext);

  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Inventory", icon: <FaBoxes />, path: "/inventory" },
    { name: "Sales", icon: <FaShoppingCart />, path: "/sales" },
    { name: "Repair", icon: <FaTools />, path: "/repair" },
    { name: "Animation", icon: <FaTools />, path: "/animation" },
  ];

  return (
    <div className="h-screen flex flex-col w-16 sm:w-52
      bg-white dark:bg-[#1a1a1a]
      border-r border-gray-200 dark:border-[#2a2a2a]
      transition-colors duration-300">

      {/* LOGO */}
      <div className="p-2 border-b border-gray-200 dark:border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <img src={theme === "dark" ? logo1 : logo} alt="logo" className={`${theme === "dark" ? "pl-2 h-10 w-auto" : "h-14 w-35"}`} />


          {theme === "dark" && (
            <div className="hidden sm:block leading-tight">
            <p className="chrome-text text-xl font-extrabold tracking-wider">
              SMART
            </p>
            <p className="text-red-500 font-bold text-lg -mt-2">
              SPIDER
            </p>
          </div>
          )}
        </div>

        <p className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block">
          Inventory System
        </p>
      </div>

      {/* MENU */}
      <div className="flex-1 mt-4 space-y-1">
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-center sm:justify-start gap-3 px-3 sm:px-5 py-3 mx-2 rounded-md transition
              ${
                isActive
                  ? "bg-gray-200 dark:bg-[#2a2a2a] border-l-0 sm:border-l-4 border-[#E61919] text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#222] hover:text-black dark:hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="hidden sm:block text-sm font-medium">
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>

      {/* THEME TOGGLE */}
      <div className="px-3 mb-3 hidden sm:block">
        <button
          onClick={toggleTheme}
          className="w-full flex cursor-pointer items-center justify-center gap-2 px-3 py-2 rounded-md
          border border-gray-300 dark:border-gray-600
          text-gray-600 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-[#222] transition"
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
          <span className="text-xs">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>

      {/* LOW STOCK */}
      <div className="px-3 mb-3 hidden sm:block">
        <div className="p-3 rounded-md
          bg-yellow-50 dark:bg-black
          border border-yellow-200 dark:border-[#2d1a00]">

          <div className="flex items-center gap-2 mb-1">
            <FaExclamationTriangle className="text-yellow-500 text-xs" />
            <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-500">
              Low Stock Alert
            </span>
          </div>

          <p className="text-[11px] text-gray-600 dark:text-gray-500 mb-2">
            3 items need restocking
          </p>

          <NavLink
            to="/inventory"
            className="text-xs cursor-pointer text-[#E61919] font-medium hover:underline"
          >
            View items →
          </NavLink>
        </div>
      </div>

      {/* PROFILE */}
      <div className="mt-auto px-3 py-3 border-t border-gray-200 dark:border-[#2a2a2a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-3xl text-gray-500 dark:text-gray-300" />

            <div className="hidden sm:block">
              <p className="text-xs font-medium text-black dark:text-white">
                Admin
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                admin@mobistock.com
              </p>
            </div>
          </div>

          <button className="hidden sm:block cursor-pointer text-gray-500 dark:text-gray-400 hover:text-red-500 transition">
            <FaSignOutAlt />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;