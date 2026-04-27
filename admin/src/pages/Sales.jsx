import React, { useState, useEffect, useContext } from "react";
import { FaShoppingCart, FaReceipt } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import NewSale from "../component/NewSale";
import SalesHistory from "../component/SalesHistory";
import toast from "react-hot-toast";

const Rs = (v) => `Rs ${Number(v).toLocaleString()}`;
const todayStr = () => new Date().toISOString().split("T")[0];

// ── Toast style ───────────────────────────────────────────────────
const toastStyle = {
  background: "#1a1a1a", color: "#fff",
  border: "1px solid #2a2a2a", borderRadius: "10px", fontSize: "13px",
};
const successToast = (msg) =>
  toast.success(msg, {
    style: { ...toastStyle, borderLeft: "3px solid #22c55e" },
    iconTheme: { primary: "#22c55e", secondary: "#1a1a1a" },
  });
const errorToast = (msg) =>
  toast.error(msg, {
    style: { ...toastStyle, borderLeft: "3px solid #b00000" },
    iconTheme: { primary: "#b00000", secondary: "#1a1a1a" },
  });

// ── Invoice number generator ──────────────────────────────────────
const genInvoiceNo = (sales) => {
  const nums = sales
    .map((s) => parseInt(s.invoiceNo?.replace("INV-", "") || "0"))
    .filter((n) => !isNaN(n) && n > 0);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `INV-${String(next).padStart(4, "0")}`;
};

const Sales = () => {
  // ✅ Pull products + loadingProducts from context (no local duplicate)
  const {
    axiosInstance,
    products,
    fetchProducts,
    loadingProducts,
  } = useContext(AppContext);

  const [sales, setSales]               = useState([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [tab, setTab]                   = useState("pos");

  // ── Fetch sales ────────────────────────────────────────────────
  const fetchSales = async () => {
    try {
      setLoadingSales(true);
      const { data } = await axiosInstance.get("/api/sales/all");
      if (data.success) setSales(data.sales);
      else errorToast(data.message || "Failed to load sales");
    } catch (err) {
      errorToast(err.response?.data?.message || "Could not load sales");
    } finally {
      setLoadingSales(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  // ── Stats ──────────────────────────────────────────────────────
  const todaySales   = sales.filter((s) => s.date === todayStr());
  const totalRevenue = sales.reduce((sum, s) => sum + s.grandTotal, 0);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalProfit  = sales.reduce(
    (sum, s) =>
      sum +
      (s.items || []).reduce((a, item) => {
        const prod = products.find(
          (p) => p._id === (item.product?._id || item.product)
        );
        return a + (prod ? (item.unitPrice - prod.cost) * item.qty : 0);
      }, 0),
    0
  );

  // ── Complete sale ─────────────────────────────────────────────
  const handleSaleComplete = async (invoiceData) => {
    const toastId = toast.loading("Processing sale...", { style: toastStyle });
    try {
      const payload = {
        invoiceNo:     genInvoiceNo(sales),
        date:          new Date().toISOString().split("T")[0],
        time:          new Date().toLocaleTimeString([], {
                         hour: "2-digit", minute: "2-digit", second: "2-digit",
                       }),
        customer: {
          name:    invoiceData.customer.name    || "Walk-in",
          phone:   invoiceData.customer.phone   || "",
          cashier: invoiceData.customer.cashier || "",
        },
        items: invoiceData.items.map((item) => ({
          product:   item.productId,
          name:      item.name,
          imei:      item.imei     || "",
          qty:       Number(item.qty),
          unitPrice: Number(item.unitPrice),
          discount:  Number(item.discount  || 0),
          subtotal:  Number(item.subtotal  || 0),
        })),
        paymentMethod: invoiceData.paymentMethod,
        subtotal:      Number(invoiceData.subtotal   || 0),
        discount:      Number(invoiceData.discount   || 0),
        grandTotal:    Number(invoiceData.grandTotal || 0),
        amountPaid:    Number(invoiceData.amountPaid || 0),
        change:        Number(invoiceData.change     || 0),
        tax:           0,
        status:        "completed",
      };

      const { data } = await axiosInstance.post("/api/sales/add", payload);
      toast.dismiss(toastId);

      if (data.success) {
        // ✅ Prepend new sale to list
        setSales((prev) => [data.sale, ...prev]);

        // ✅ Deduct sold qty from context products immediately (optimistic)
        // setProducts((prev) =>
        //   prev.map((p) => {
        //     const soldItem = payload.items.find((i) => i.product === p._id);
        //     return soldItem ? { ...p, qty: p.qty - soldItem.qty } : p;
        //   })
        // );

        // ✅ Also re-fetch from server to ensure accuracy
        fetchProducts();

        // ✅ Return success — toast fires AFTER modal closes (in NewSale)
        return { success: true, sale: data.sale, successToast };
      } else {
        errorToast(data.message || "Failed to complete sale");
        return { success: false };
      }
    } catch (err) {
      toast.dismiss(toastId);
  console.error("Full error object:", err);
  console.error("err.response:", err.response);
  console.error("err.request:", err.request);
  console.error("err.code:", err.code);
  
  const serverMsg = err.response?.data?.message || err.message || "Sale failed";
  errorToast(serverMsg);
  return { success: false };
      errorToast(err.response?.data?.message || "Sale failed. Please try again.");
      return { success: false };
    }
  };

  const isLoading = loadingProducts || loadingSales;

  return (
    <div className="text-gray-900 dark:text-white space-y-4 sm:space-y-5">

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Invoices", value: sales.length,     color: "text-blue-500 dark:text-blue-400",    border: "border-blue-500/20"   },
          { label: "Today Revenue",  value: Rs(todayRevenue), color: "text-yellow-500 dark:text-yellow-400", border: "border-yellow-500/20" },
          { label: "Total Revenue",  value: Rs(totalRevenue), color: "text-green-500 dark:text-green-400",  border: "border-green-500/20"  },
          { label: "Total Profit",   value: Rs(totalProfit),  color: "text-red-500 dark:text-red-400",      border: "border-red-500/20"    },
        ].map((s, i) => (
          <div
            key={i}
            className={`border ${s.border} rounded-xl p-3 sm:p-4 backdrop-blur-sm bg-white/80 dark:bg-[rgba(17,17,17,0.6)]`}
          >
            <div className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${s.color} mb-1 sm:mb-2`}>
              {s.label}
            </div>
            <div className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              {isLoading
                ? <span className="animate-pulse text-gray-400">—</span>
                : s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex gap-1 p-1 rounded-xl border border-gray-200 dark:border-[#1f1f1f] w-fit bg-gray-100 dark:bg-[rgba(10,10,10,0.6)]">
        {[
          { key: "pos",     icon: <FaShoppingCart size={12} />, label: "New Sale"      },
          { key: "history", icon: <FaReceipt size={12} />,      label: "Sales History" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition
              ${tab === t.key
                ? "bg-[#b00000] text-white"
                : "bg-transparent text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Active Tab ── */}
      {tab === "pos" && (
        <NewSale
          products={products}
          loadingProducts={loadingProducts}
          onSaleComplete={handleSaleComplete}
          onViewHistory={() => setTab("history")}
        />
      )}

      {tab === "history" && (
        <SalesHistory
          sales={sales}
          loading={loadingSales}
          onRefresh={fetchSales}
        />
      )}
    </div>
  );
};

export default Sales;