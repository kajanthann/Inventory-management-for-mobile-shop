import React, { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, Navigate } from "react-router-dom";

import Sidebar from "./component/SideBar";
import Login from "./component/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Repair from "./pages/Repair";
import Sales from "./pages/Sales";
import Animation from "./pages/Animation";
import SpiderBackground from "./component/SpiderBackground";
import Loading from "./component/Loading";

import { AppContext } from "./context/AppContext";

// ── Protected Route ──
const ProtectedRoute = ({ children }) => {
  const { aToken } = useContext(AppContext);
  const token = aToken || localStorage.getItem("aToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ── App Layout ──
const AppLayout = () => {
  const { theme, loading } = useContext(AppContext);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 dark:bg-[#0f0f0f] p-6 overflow-auto relative">

        <SpiderBackground />

        {/* 🔥 LOADING OVERLAY (ONLY MAIN CONTENT) */}
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <Loading />
          </div>
        )}

        {/* Page Content */}
        <div className="relative z-10 mt-1">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/repair" element={<Repair />} />
            <Route path="/animation" element={<Animation />} />
          </Routes>
        </div>

      </div>
    </div>
  );
};

// ── Root App ──
const App = () => {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected App */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;