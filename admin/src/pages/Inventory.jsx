// Inventory.jsx
import React, { useState } from "react";
import {
  FaBox, FaExclamationTriangle, FaDollarSign,
  FaPlus, FaEdit, FaTrash, FaEye, FaSearch,
  FaTimes, FaFilter,
} from "react-icons/fa";

const categories = [
  "Smartphones","Tablets","Wearables","Display","Battery",
  "Charger","Cable","Handfree","Airpods","Covers","Others",
];

const initialProducts = [
  { id: 1, name: "iPhone 13", sku: "IP13-001", category: "Smartphones", qty: 4, cost: 200000, price: 250000, supplier: "Apple LK", description: "Flagship phone", updated: "2026-04-20" },
  { id: 2, name: "Samsung S24", sku: "SAM-S24", category: "Smartphones", qty: 12, cost: 180000, price: 220000, supplier: "Samsung LK", description: "Android flagship", updated: "2026-04-19" },
  { id: 3, name: "iPhone Charger 20W", sku: "CHR-20W", category: "Charger", qty: 3, cost: 3500, price: 5000, supplier: "Apple LK", description: "Original charger", updated: "2026-04-18" },
  { id: 4, name: "AirPods Pro 2", sku: "APP-PRO2", category: "Airpods", qty: 8, cost: 28000, price: 35000, supplier: "Apple LK", description: "ANC earbuds", updated: "2026-04-17" },
];

const emptyForm = { name: "", sku: "", category: "", qty: "", cost: "", price: "", supplier: "", description: "" };

const Inventory = () => {
  const [products, setProducts] = useState(initialProducts);
  const [open, setOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = products.filter((p) =>
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())) &&
    (categoryFilter === "" || p.category === categoryFilter)
  );

  const totalProducts = products.length;
  const lowStock = products.filter((p) => Number(p.qty) <= 5).length;
  const totalValue = products.reduce((s, p) => s + Number(p.qty) * Number(p.price), 0);

  const openAdd = () => { setForm(emptyForm); setEditItem(null); setOpen(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditItem(p.id); setOpen(true); };
  const closeModal = () => { setOpen(false); setViewItem(null); };

  const handleSave = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    if (editItem) {
      setProducts(products.map((p) => p.id === editItem ? { ...form, id: editItem, qty: Number(form.qty), cost: Number(form.cost), price: Number(form.price), updated: today } : p));
    } else {
      setProducts([...products, { ...form, id: Date.now(), qty: Number(form.qty), cost: Number(form.cost), price: Number(form.price), updated: today }]);
    }
    closeModal();
  };

  const handleDelete = (id) => setProducts(products.filter((p) => p.id !== id));
  const f = (v) => `Rs ${Number(v).toLocaleString()}`;

  return (
    <div className="text-white space-y-4 sm:space-y-5">

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon: <FaBox />, label: "Total Products", value: totalProducts, color: "text-blue-400", border: "border-blue-500/20" },
          { icon: <FaExclamationTriangle />, label: "Low Stock", value: lowStock, color: "text-yellow-400", border: "border-yellow-500/20" },
          { icon: <FaDollarSign />, label: "Inventory Value", value: `Rs ${totalValue.toLocaleString()}`, color: "text-green-400", border: "border-green-500/20" },
        ].map((s, i) => (
          <div key={i} className={`border ${s.border} rounded-xl p-3 sm:p-4 backdrop-blur-sm`} style={{ background: "rgba(17,17,17,0.6)" }}>
            <div className={`flex items-center gap-2 text-xs sm:text-sm ${s.color} mb-1 sm:mb-2`}>{s.icon} {s.label}</div>
            <div className="text-xl sm:text-2xl font-bold text-white truncate">{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1 flex-wrap">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
            <input
              placeholder="Search name / SKU..."
              className="w-full sm:w-auto pl-8 pr-3 py-2 rounded-lg text-sm outline-none border border-[#1f1f1f] focus:border-[#b00000] transition text-white"
              style={{ background: "rgba(10,10,10,0.7)" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
            <select
              className="w-full sm:w-auto pl-8 pr-3 py-2 rounded-lg text-sm outline-none border border-[#1f1f1f] focus:border-[#b00000] transition text-white"
              style={{ background: "rgba(10,10,10,0.7)" }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          </div>
          {(search || categoryFilter) && (
            <button onClick={() => { setSearch(""); setCategoryFilter(""); }} className="text-gray-500 hover:text-white transition self-start sm:self-center">
              <FaTimes />
            </button>
          )}
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition w-full sm:w-auto"
          style={{ background: "#b00000" }}
          onMouseEnter={e => e.currentTarget.style.background = "#8b0000"}
          onMouseLeave={e => e.currentTarget.style.background = "#b00000"}
        >
          <FaPlus size={11} /> Add Product
        </button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-[#1f1f1f] overflow-hidden" style={{ background: "rgba(17,17,17,0.6)", backdropFilter: "blur(8px)" }}>
        <div className="px-3 sm:px-4 py-3 border-b border-[#1f1f1f] flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-300">Products</span>
          <span className="text-xs text-gray-500">{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Mobile card view */}
        <div className="block sm:hidden divide-y divide-[#1a1a1a]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-600 text-sm">No products found</div>
          ) : filtered.map((p) => (
            <div key={p.id} className="p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium text-white text-sm truncate">{p.name}</div>
                  <div className="text-[11px] font-mono text-gray-500 mt-0.5">{p.sku}</div>
                </div>
                <span className={`flex-shrink-0 px-2 py-0.5 text-[10px] rounded-full font-medium ${p.qty <= 5 ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
                  {p.qty === 0 ? "Out of Stock" : p.qty <= 5 ? "Low Stock" : "In Stock"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-gray-500 mb-0.5">Category</div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] border border-[#2a2a2a] text-gray-300" style={{ background: "rgba(255,255,255,0.03)" }}>{p.category}</span>
                </div>
                <div>
                  <div className="text-gray-500 mb-0.5">Qty</div>
                  <div className="font-semibold text-white">{p.qty}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-0.5">Updated</div>
                  <div className="text-gray-400">{p.updated}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-500 mb-0.5">Cost</div>
                  <div className="text-gray-400">{f(p.cost)}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-0.5">Price</div>
                  <div className="text-green-400 font-medium">{f(p.price)}</div>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setViewItem(p)} className="flex-1 py-1.5 rounded border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition text-xs flex items-center justify-center gap-1">
                  <FaEye size={10} /> View
                </button>
                <button onClick={() => openEdit(p)} className="flex-1 py-1.5 rounded border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 transition text-xs flex items-center justify-center gap-1">
                  <FaEdit size={10} /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="flex-1 py-1.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/10 transition text-xs flex items-center justify-center gap-1">
                  <FaTrash size={10} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table view */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "700px" }}>
            <thead>
              <tr className="text-[11px] text-gray-500 uppercase tracking-wider border-b border-[#1f1f1f]">
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Qty</th>
                <th className="px-4 py-3 text-left">Cost</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Updated</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-12 text-gray-600">No products found</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-t border-[#1a1a1a] hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs border border-[#2a2a2a] text-gray-300" style={{ background: "rgba(255,255,255,0.03)" }}>{p.category}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{p.qty}</td>
                  <td className="px-4 py-3 text-gray-400">{f(p.cost)}</td>
                  <td className="px-4 py-3 text-green-400 font-medium">{f(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${p.qty <= 5 ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
                      {p.qty === 0 ? "Out of Stock" : p.qty <= 5 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.updated}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setViewItem(p)} className="p-1.5 rounded border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition"><FaEye size={11} /></button>
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 transition"><FaEdit size={11} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/10 transition"><FaTrash size={11} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {open && (
        <div className="fixed inset-0 bg-black/75 flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-[460px] rounded-xl border border-[#1f1f1f] overflow-hidden my-auto" style={{ background: "#111111" }}>
            <div className="px-4 sm:px-5 py-4 border-b border-[#1f1f1f] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white">{editItem ? "Edit Product" : "Add Product"}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{editItem ? "Update product details" : "Fill in product information"}</p>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition"><FaTimes /></button>
            </div>
            <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-500 font-semibold tracking-wider block mb-1">NAME *</label>
                  <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-[#1f1f1f] text-white outline-none focus:border-[#b00000] transition"
                    style={{ background: "#0a0a0a" }} />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 font-semibold tracking-wider block mb-1">SKU *</label>
                  <input required placeholder="e.g. IP13-001" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-[#1f1f1f] text-white outline-none focus:border-[#b00000] transition"
                    style={{ background: "#0a0a0a" }} />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 font-semibold tracking-wider block mb-1">CATEGORY *</label>
                <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm border border-[#1f1f1f] text-white outline-none focus:border-[#b00000] transition"
                  style={{ background: "#0a0a0a" }}>
                  <option value="">Select category</option>
                  {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[["QTY *","qty","0"],["COST (Rs) *","cost","0"],["PRICE (Rs) *","price","0"]].map(([label, key, ph]) => (
                  <div key={key}>
                    <label className="text-[11px] text-gray-500 font-semibold tracking-wider block mb-1">{label}</label>
                    <input required type="number" placeholder={ph} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-2 sm:px-3 py-2 rounded-lg text-sm border border-[#1f1f1f] text-white outline-none focus:border-[#b00000] transition"
                      style={{ background: "#0a0a0a" }} />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[11px] text-gray-500 font-semibold tracking-wider block mb-1">SUPPLIER</label>
                <input placeholder="Supplier name" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm border border-[#1f1f1f] text-white outline-none focus:border-[#b00000] transition"
                  style={{ background: "#0a0a0a" }} />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 font-semibold tracking-wider block mb-1">DESCRIPTION</label>
                <textarea rows="2" placeholder="Optional notes..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm border border-[#1f1f1f] text-white outline-none focus:border-[#b00000] transition resize-none"
                  style={{ background: "#0a0a0a" }} />
              </div>
              <div className="flex gap-2 sm:gap-3 pt-1">
                <button type="button" onClick={closeModal}
                  className="flex-1 py-2 rounded-lg text-sm border border-[#1f1f1f] text-gray-400 hover:text-white transition"
                  style={{ background: "transparent" }}>
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition"
                  style={{ background: "#b00000" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#8b0000"}
                  onMouseLeave={e => e.currentTarget.style.background = "#b00000"}>
                  {editItem ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Modal ── */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="w-full max-w-[400px] rounded-xl border border-[#1f1f1f] max-h-[90vh] overflow-y-auto" style={{ background: "#111111" }}>
            <div className="px-4 sm:px-5 py-4 border-b border-[#1f1f1f] flex items-center justify-between sticky top-0" style={{ background: "#111111" }}>
              <div className="min-w-0">
                <h2 className="font-semibold text-white truncate">{viewItem.name}</h2>
                <p className="text-xs font-mono text-gray-500 mt-0.5">{viewItem.sku}</p>
              </div>
              <button onClick={() => setViewItem(null)} className="text-gray-500 hover:text-white transition ml-2 flex-shrink-0"><FaTimes /></button>
            </div>
            <div className="p-4 sm:p-5 space-y-2 sm:space-y-3">
              {[
                ["Category", viewItem.category],
                ["Quantity", viewItem.qty],
                ["Cost Price", f(viewItem.cost)],
                ["Selling Price", f(viewItem.price)],
                ["Profit Margin", `Rs ${((viewItem.price - viewItem.cost) * viewItem.qty).toLocaleString()}`],
                ["Supplier", viewItem.supplier || "—"],
                ["Last Updated", viewItem.updated],
                ["Description", viewItem.description || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center text-sm py-1 border-b border-[#1a1a1a] gap-2">
                  <span className="text-gray-500 flex-shrink-0">{k}</span>
                  <span className="text-white font-medium text-right break-words">{v}</span>
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