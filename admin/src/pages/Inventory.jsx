import React, { useState, useEffect, useContext } from "react";
import {
  FaBox, FaExclamationTriangle, FaDollarSign,
  FaPlus, FaEdit, FaTrash, FaEye, FaSearch,
  FaTimes, FaFilter,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext"; // adjust path if needed

const categories = [
  "Smartphones","Tablets","Wearables","Display","Battery",
  "Charger","Cable","Handfree","Airpods","Covers","Others",
];

const emptyForm = {
  name: "", imei: "", category: "", qty: "",
  cost: "", price: "", supplier: "", description: "",
};

// ── Toast helpers ────────────────────────────────────────────────
const toastStyle = {
  background: "#1a1a1a",
  color: "#fff",
  border: "1px solid #2a2a2a",
  borderRadius: "10px",
  fontSize: "13px",
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
const loadingToast = (msg) =>
  toast.loading(msg, { style: toastStyle });

// ════════════════════════════════════════════════════════════════
const Inventory = () => {
  const { axiosInstance, theme } = useContext(AppContext);

  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [open, setOpen]                     = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [viewItem, setViewItem]             = useState(null);
  const [editItem, setEditItem]             = useState(null); // holds _id string
  const [form, setForm]                     = useState(emptyForm);
  const [search, setSearch]                 = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // ── Derived stats ──────────────────────────────────────────────
  const filtered = products.filter((p) =>
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.imei.toLowerCase().includes(search.toLowerCase())) &&
    (categoryFilter === "" || p.category === categoryFilter)
  );

  const totalProducts = products.length;
  const lowStock      = products.filter((p) => Number(p.qty) <= 5).length;
  const totalValue    = products.reduce((s, p) => s + Number(p.qty) * Number(p.price), 0);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  // ── Modal helpers ──────────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm);
    setEditItem(null);
    setOpen(true);
  };

  const openEdit = (p) => {
    setForm({
      name:        p.name,
      imei:        p.imei,
      category:    p.category,
      qty:         p.qty,
      cost:        p.cost,
      price:       p.price,
      supplier:    p.supplier || "",
      description: p.description || "",
    });
    setEditItem(p._id);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setViewItem(null);
    setEditItem(null);
    setForm(emptyForm);
  };

  // ── Add Product ───────────────────────────────────────────────
  const handleAdd = async () => {
    const toastId = loadingToast("Adding product...");
    try {
      const { data } = await axiosInstance.post("/api/products/add", {
        name:        form.name,
        imei:        form.imei,
        category:    form.category,
        qty:         Number(form.qty),
        cost:        Number(form.cost),
        price:       Number(form.price),
        supplier:    form.supplier,
        description: form.description,
      });
      toast.dismiss(toastId);
      if (data.success) {
        successToast("Product added successfully!");
        setProducts((prev) => [data.product, ...prev]);
        closeModal();
      } else {
        errorToast(data.message || "Failed to add product.");
      }
    } catch (err) {
      toast.dismiss(toastId);
      errorToast(err.response?.data?.message || "Failed to add product.");
    }
  };

  // ── Update Product ─────────────────────────────────────────────
  const handleUpdate = async () => {
    const toastId = loadingToast("Updating product...");
    try {
      const { data } = await axiosInstance.put(`/api/products/update/${editItem}`, {
        name:        form.name,
        imei:        form.imei,
        category:    form.category,
        qty:         Number(form.qty),
        cost:        Number(form.cost),
        price:       Number(form.price),
        supplier:    form.supplier,
        description: form.description,
      });
      toast.dismiss(toastId);
      if (data.success) {
        successToast("Product updated successfully!");
        setProducts((prev) =>
          prev.map((p) => (p._id === editItem ? data.product : p))
        );
        closeModal();
      } else {
        errorToast(data.message || "Failed to update product.");
      }
    } catch (err) {
      toast.dismiss(toastId);
      errorToast(err.response?.data?.message || "Failed to update product.");
    }
  };

  // ── Save handler (add or update) ──────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    if (editItem) {
      await handleUpdate();
    } else {
      await handleAdd();
    }
    setSubmitting(false);
  };

  // ── Delete Product ─────────────────────────────────────────────
const handleDelete = (id) => {
  const itemToDelete = products.find((p) => p._id === id);
  if (!itemToDelete) return;

  let undo = false;
  let confirmToastId;
  let undoToastId;

  // ─────────────────────────────
  // 1. CONFIRMATION TOAST
  // ─────────────────────────────
  confirmToastId = toast.custom((t) => (
    <div
      className={`p-4 rounded-lg shadow-lg border w-[300px]
        ${theme === "dark"
          ? "bg-[#1a1a1a] border-[#2a2a2a] text-white"
          : "bg-white border-gray-200 text-black"
        }`}
    >
      <p className="text-sm mb-3 font-medium">
        Delete this product?
      </p>

      <div className="flex justify-end gap-2">
        {/* Cancel */}
        <button
          onClick={() => {
            toast.dismiss(t.id); // close confirm
          }}
          className={`px-3 py-1 text-xs rounded transition
            ${theme === "dark"
              ? "bg-gray-600 hover:bg-gray-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-black"
            }`}
        >
          Cancel
        </button>

        {/* Confirm Delete */}
        <button
          onClick={() => {
            toast.dismiss(t.id); // close confirm immediately
            proceedDelete();     // go to undo flow
          }}
          className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-500 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  ), { duration: 5000 });

  const proceedDelete = () => {
    // optimistic remove
    setProducts((prev) => prev.filter((p) => p._id !== id));

    undo = false;

    undoToastId = toast.custom((t) => (
      <div
        className={`p-4 rounded-lg shadow-lg border w-[300px]
          ${theme === "dark"
            ? "bg-[#1a1a1a] border-[#2a2a2a] text-white"
            : "bg-white border-gray-200 text-black"
          }`}
      >
        <p className="text-sm mb-2 font-medium">
          Product deleted
        </p>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            Undo available (5s)
          </span>

          <button
            onClick={() => {
              undo = true;
              toast.dismiss(t.id);

              // restore item
              setProducts((prev) => [itemToDelete, ...prev]);
            }}
            className="px-3 py-1 text-xs rounded bg-yellow-500 text-black hover:bg-yellow-400"
          >
            Undo
          </button>
        </div>
      </div>
    ), { duration: 5000 });

    // ─────────────────────────────
    // 3. FINAL DELETE AFTER 5s
    // ─────────────────────────────
    setTimeout(async () => {
      if (undo) return;

      try {
        await axiosInstance.delete(`/api/products/delete/${id}`);

        toast.success("Deleted permanently", {
          style: {
            background: theme === "dark" ? "#1a1a1a" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
            border: "1px solid #2a2a2a",
          },
        });
      } catch (err) {
        toast.error("Delete failed (restoring item)");

        // rollback
        setProducts((prev) => [itemToDelete, ...prev]);
      }
    }, 5000);
  };
};

  const f = (v) => `Rs ${Number(v).toLocaleString()}`;

  const inputCls =
    "w-full px-3 py-2 rounded-lg text-sm outline-none transition border focus:border-[#b00000] bg-gray-100 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#1f1f1f] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600";

  // ── Skeleton loader ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1,2,3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-200 dark:bg-[#1a1a1a]" />
          ))}
        </div>
        <div className="h-10 rounded-lg bg-gray-200 dark:bg-[#1a1a1a] w-full" />
        <div className="rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="h-12 border-b border-gray-100 dark:border-[#1a1a1a] bg-gray-50 dark:bg-[#111]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-900 dark:text-white space-y-4 sm:space-y-5">

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            icon: <FaBox />,
            label: "Total Products",
            value: totalProducts,
            color: "text-blue-500 dark:text-blue-400",
            border: "border-blue-500/20",
          },
          {
            icon: <FaExclamationTriangle />,
            label: "Low Stock",
            value: lowStock,
            color: "text-yellow-500 dark:text-yellow-400",
            border: "border-yellow-500/20",
          },
          {
            icon: <FaDollarSign />,
            label: "Inventory Value",
            value: `Rs ${totalValue.toLocaleString()}`,
            color: "text-green-500 dark:text-green-400",
            border: "border-green-500/20",
          },
        ].map((s, i) => (
          <div key={i} className={`border ${s.border} rounded-xl p-3 sm:p-4 backdrop-blur-sm bg-white/80 dark:bg-[rgba(17,17,17,0.6)]`}>
            <div className={`flex items-center gap-2 text-xs sm:text-sm ${s.color} mb-1 sm:mb-2`}>
              {s.icon} {s.label}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1 flex-wrap">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
            <input
              placeholder="Search name / imei..."
              className={`${inputCls} pl-8 w-full sm:w-auto`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
            <select
              className={`${inputCls} pl-8 w-full sm:w-auto`}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          </div>
          {(search || categoryFilter) && (
            <button
              onClick={() => { setSearch(""); setCategoryFilter(""); }}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition self-start sm:self-center"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition w-full sm:w-auto bg-[#b00000] hover:bg-[#8b0000]"
        >
          <FaPlus size={11} /> Add Product
        </button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm">
        <div className="px-3 sm:px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Products</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Mobile card view ── */}
        <div className="block sm:hidden divide-y divide-gray-100 dark:divide-[#1a1a1a]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-gray-600 text-sm">
              No products found
            </div>
          ) : filtered.map((p) => (
            <div key={p._id} className="p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white text-sm truncate">{p.name}</div>
                  <div className="text-[11px] font-mono text-gray-400 dark:text-gray-500 mt-0.5">{p.imei}</div>
                </div>
                <span className={`flex-shrink-0 px-2 py-0.5 text-[10px] rounded-full font-medium ${
                  p.qty === 0
                    ? "bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20"
                    : p.qty <= 5
                    ? "bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 border border-yellow-500/20"
                    : "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                }`}>
                  {p.qty === 0 ? "Out of Stock" : p.qty <= 5 ? "Low Stock" : "In Stock"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-gray-400 dark:text-gray-500 mb-0.5">Category</div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] border border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/[0.03]">
                    {p.category}
                  </span>
                </div>
                <div>
                  <div className="text-gray-400 dark:text-gray-500 mb-0.5">Qty</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{p.qty}</div>
                </div>
                <div>
                  <div className="text-gray-400 dark:text-gray-500 mb-0.5">Updated</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {new Date(p.updatedAt).toLocaleDateString("en-CA")}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-400 dark:text-gray-500 mb-0.5">Cost</div>
                  <div className="text-gray-500 dark:text-gray-400">{f(p.cost)}</div>
                </div>
                <div>
                  <div className="text-gray-400 dark:text-gray-500 mb-0.5">Price</div>
                  <div className="text-green-600 dark:text-green-400 font-medium">{f(p.price)}</div>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setViewItem(p)}
                  className="flex-1 py-1.5 rounded border border-blue-500/20 text-blue-500 dark:text-blue-400 hover:bg-blue-500/10 transition text-xs flex items-center justify-center gap-1"
                >
                  <FaEye size={10} /> View
                </button>
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 py-1.5 rounded border border-yellow-500/20 text-yellow-500 dark:text-yellow-400 hover:bg-yellow-500/10 transition text-xs flex items-center justify-center gap-1"
                >
                  <FaEdit size={10} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 py-1.5 rounded border border-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-500/10 transition text-xs flex items-center justify-center gap-1"
                >
                  <FaTrash size={10} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Desktop table view ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "700px" }}>
            <thead>
              <tr className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-[#1f1f1f]">
                {["Product","IMEI","Category","Qty","Cost","Price","Status","Updated","Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-400 dark:text-gray-600">
                    No products found
                  </td>
                </tr>
              ) : filtered.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{p.name}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.imei}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs border border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/[0.03]">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{p.qty}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{f(p.cost)}</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400 font-medium">{f(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      p.qty === 0
                        ? "bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20"
                        : p.qty <= 5
                        ? "bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 border border-yellow-500/20"
                        : "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                    }`}>
                      {p.qty === 0 ? "Out of Stock" : p.qty <= 5 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 dark:text-gray-500 text-xs">
                    {new Date(p.updatedAt).toLocaleDateString("en-CA")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setViewItem(p)}
                        className="p-1.5 rounded border border-blue-500/20 text-blue-500 dark:text-blue-400 hover:bg-blue-500/10 transition"
                        title="View"
                      >
                        <FaEye size={11} />
                      </button>
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded border border-yellow-500/20 text-yellow-500 dark:text-yellow-400 hover:bg-yellow-500/10 transition"
                        title="Edit"
                      >
                        <FaEdit size={11} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 rounded border border-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-500/10 transition"
                        title="Delete"
                      >
                        <FaTrash size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {open && (
        <div className="fixed inset-0 bg-black/75 flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-[460px] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden my-auto bg-white dark:bg-[#111111]">
            <div className="px-4 sm:px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {editItem ? "Edit Product" : "Add Product"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editItem ? "Update product details" : "Fill in product information"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider block mb-1">
                    NAME *
                  </label>
                  <input
                    required
                    placeholder="Product name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider block mb-1">
                    IMEI *
                  </label>
                  <input
                    required
                    placeholder="e.g. IP13-001"
                    value={form.imei}
                    onChange={(e) => setForm({ ...form, imei: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider block mb-1">
                  CATEGORY *
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputCls}
                >
                  <option value="">Select category</option>
                  {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  ["QTY *",      "qty",   "0"],
                  ["COST (Rs) *","cost",  "0"],
                  ["PRICE (Rs) *","price","0"],
                ].map(([label, key, ph]) => (
                  <div key={key}>
                    <label className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider block mb-1">
                      {label}
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      placeholder={ph}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider block mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows="2"
                  placeholder="Optional notes..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className="flex gap-2 sm:gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 rounded-lg text-sm border border-gray-300 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-transparent transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition flex items-center justify-center gap-2 bg-[#b00000] hover:bg-[#8b0000] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {editItem ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    editItem ? "Update Product" : "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Modal ── */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="w-full max-w-[400px] rounded-xl border border-gray-200 dark:border-[#1f1f1f] max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111111]">
            <div className="px-4 sm:px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between sticky top-0 bg-white dark:bg-[#111111] z-10">
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900 dark:text-white truncate">{viewItem.name}</h2>
                <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5">{viewItem.imei}</p>
              </div>
              <button
                onClick={() => setViewItem(null)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition ml-2 flex-shrink-0"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-2 sm:space-y-3">
              {[
                ["Category",      viewItem.category],
                ["Quantity",      viewItem.qty],
                ["Cost Price",    f(viewItem.cost)],
                ["Selling Price", f(viewItem.price)],
                ["Profit / Unit", `Rs ${(Number(viewItem.price) - Number(viewItem.cost)).toLocaleString()}`],
                ["Total Profit",  `Rs ${((Number(viewItem.price) - Number(viewItem.cost)) * Number(viewItem.qty)).toLocaleString()}`],
                ["Last Updated",  new Date(viewItem.updatedAt).toLocaleDateString("en-CA")],
                ["Description",   viewItem.description || "—"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between items-center text-sm py-1 border-b border-gray-100 dark:border-[#1a1a1a] gap-2"
                >
                  <span className="text-gray-500 flex-shrink-0">{k}</span>
                  <span className="text-gray-900 dark:text-white font-medium text-right break-words">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Inventory;