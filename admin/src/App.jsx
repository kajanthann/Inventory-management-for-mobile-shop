import React, { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, Navigate } from "react-router-dom";

import SideBar from "./component/Sidebar";
import Login from "./component/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Repair from "./pages/Repair";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import SpiderBackground from "./component/SpiderBackground";

import { AppContext } from "./context/AppContext";
import SmartSpiderInvoice from "./component/BillingModal";
import InvoicePrint from "./pages/InvoicePrint";
import PreOrder from "./pages/PreOrder";

/* ─────────────────────────────
   🔐 PROTECTED ROUTE
───────────────────────────── */
const ProtectedRoute = ({ children }) => {
  const { aToken } = useContext(AppContext);
  const token = aToken || localStorage.getItem("aToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* ─────────────────────────────
   🚫 PUBLIC ROUTE (LOGIN GUARD)
───────────────────────────── */
const PublicRoute = ({ children }) => {
  const { aToken } = useContext(AppContext);
  const token = aToken || localStorage.getItem("aToken");

  // already logged → go dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/* ─────────────────────────────
   🧱 APP LAYOUT
───────────────────────────── */
const AppLayout = () => {
  const { loading } = useContext(AppContext);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white relative">

      {/* Background — fixed to viewport, sits behind everything, never scrolls */}
      <SpiderBackground />

      {/* Sidebar */}
      <SideBar />

      {/* Main scrollable area */}
      <div className="flex-1 overflow-auto relative z-10">
        <div className="p-6">

          {/* Pages */}
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/repair" element={<Repair />} />
            <Route path="/pre-order" element={<PreOrder />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/bill" element={<SmartSpiderInvoice />} />
            <Route path="/sales/invoice" element={<InvoicePrint />} />
          </Routes>

        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────
   🚀 ROOT APP
───────────────────────────── */
const App = () => {
  return (
    <div>
      {/* Toast */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>

        {/* Default Route */}
        <Route
          path="/"
          element={
            localStorage.getItem("aToken")
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

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