import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxes,
  FaShoppingCart,
  FaTools,
  FaUserCircle,
  FaSignOutAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

const Sidebar = () => {
  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Inventory", icon: <FaBoxes />, path: "/inventory" },
    { name: "Sales", icon: <FaShoppingCart />, path: "/sales" },
    { name: "Repair", icon: <FaTools />, path: "/repair" },
  ];

  return (
    <div className="h-screen bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col 
                    w-16 sm:w-56 transition-all duration-300">

      {/* LOGO */}
      <div className="p-4 border-b border-[#2a2a2a]">
        <h1 className="text-lg sm:text-2xl font-bold text-center sm:text-left">
          <span className="text-white">S</span>
          <span className="text-[#E61919] sm:inline hidden">martSpider</span>
        </h1>
        <p className="text-[10px] text-gray-400 hidden sm:block">
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
                  ? "bg-[#2a2a2a] border-l-0 sm:border-l-4 border-[#E61919] text-white"
                  : "text-gray-400 hover:bg-[#222] hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>

            {/* TEXT HIDDEN ON MOBILE */}
            <span className="text-sm font-medium hidden sm:block">
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>

      {/* LOW STOCK ALERT (hide in mobile) */}
      <div className="px-3 mb-3 hidden sm:block">
        <div className="p-3 bg-black border border-[#2d1a00] rounded-md">
          <div className="flex items-center gap-2 mb-1">
            <FaExclamationTriangle className="text-yellow-500 text-xs" />
            <span className="text-xs font-semibold text-yellow-500">
              Low Stock Alert
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-2">
            3 items need restocking
          </p>

          <NavLink
            to="/inventory"
            className="text-xs text-[#E61919] font-medium hover:underline"
          >
            View items →
          </NavLink>
        </div>
      </div>

      {/* PROFILE */}
      <div className="mt-auto px-2 sm:px-3 py-3 border-t border-[#2a2a2a]">
        <div className="flex items-center justify-center sm:justify-between">

          {/* PROFILE */}
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-2xl sm:text-3xl text-gray-300" />

            {/* HIDE TEXT ON MOBILE */}
            <div className="hidden sm:block">
              <p className="text-sm text-white font-medium">Admin</p>
              <p className="text-xs text-gray-400">
                admin@mobistock.com
              </p>
            </div>
          </div>

          {/* LOGOUT */}
          <button className="hidden sm:block text-gray-400 hover:text-red-500 transition cursor-pointer">
            <FaSignOutAlt />
          </button>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;