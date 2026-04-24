import React, { useState } from "react";
import {
  FaPlus, FaTrash, FaTimes, FaSearch, FaShoppingCart,
  FaCheck, FaMinus, FaUndo, FaReceipt,
} from "react-icons/fa";

const PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer", "Online"];
const Rs = (v) => `Rs ${Number(v).toLocaleString()}`;
const today = () => new Date().toISOString().split("T")[0];
const timeNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

const inputCls = "w-full px-3 py-2 rounded-lg text-sm outline-none transition border focus:border-[#b00000] bg-gray-100 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#1f1f1f] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600";
const cardCls  = "rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm";

let invoiceCounter = 4;
const genInvoice = () => `INV-${String(invoiceCounter++).padStart(4, "0")}`;

const NewSale = ({ products, onSaleComplete, onViewHistory }) => {
  const [cartItems, setCartItems]         = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [customer, setCustomer]           = useState({ name: "", cashier: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [amountPaid, setAmountPaid]       = useState("");
  const [successInvoice, setSuccessInvoice] = useState(null);
  const [mobilePanel, setMobilePanel]     = useState("products");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.imei.toLowerCase().includes(productSearch.toLowerCase())
  );

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, qty: Math.min(i.qty + 1, product.stock), subtotal: (i.qty + 1) * i.unitPrice - i.discount }
            : i
        );
      }
      return [...prev, {
        id: product.id, name: product.name, imei: product.imei,
        qty: 1, unitPrice: product.price, discount: 0, subtotal: product.price,
      }];
    });
  };

  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const newQty = Math.max(1, i.qty + delta);
        const prod = products.find((p) => p.id === id);
        const capped = Math.min(newQty, prod?.stock || 99);
        return { ...i, qty: capped, subtotal: capped * i.unitPrice - i.discount };
      })
    );
  };

  const updateItemDiscount = (id, val) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, discount: Number(val) || 0, subtotal: i.qty * i.unitPrice - (Number(val) || 0) }
          : i
      )
    );
  };

  const removeFromCart = (id) => setCartItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => { setCartItems([]); setGlobalDiscount(0); setAmountPaid(""); };

  const subtotal   = cartItems.reduce((s, i) => s + i.subtotal, 0);
  const discount   = Number(globalDiscount) || 0;
  const grandTotal = Math.max(0, subtotal - discount);
  const paid       = Number(amountPaid) || 0;
  const change     = Math.max(0, paid - grandTotal);

  const handleCompleteSale = () => {
    if (cartItems.length === 0) return alert("Cart is empty.");
    if (paid < grandTotal) return alert("Amount paid is less than grand total.");

    const invoice = {
      id: Date.now(), invoiceNo: genInvoice(), date: today(), time: timeNow(),
      customer: { ...customer }, items: [...cartItems], paymentMethod,
      subtotal, discount, tax: 0, grandTotal, amountPaid: paid, change, status: "completed",
    };

    onSaleComplete(invoice);
    setSuccessInvoice(invoice);
    setCartItems([]);
    setCustomer({ name: "", cashier: "", phone: "" });
    setGlobalDiscount(0);
    setAmountPaid("");
    setProductSearch("");
    setMobilePanel("products");
  };

  return (
    <>
      {/* Mobile panel toggle */}
      <div className="flex lg:hidden gap-1 p-1 rounded-xl border border-gray-200 dark:border-[#1f1f1f] w-fit bg-gray-100 dark:bg-[rgba(10,10,10,0.6)]">
        {[
          { key: "products", label: "Products & Cart" },
          { key: "invoice",  label: `Invoice${cartItems.length > 0 ? ` (${cartItems.length})` : ""}` },
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => setMobilePanel(p.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
              ${mobilePanel === p.key
                ? "bg-[#b00000] text-white"
                : "bg-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4">

        {/* ── Left: Product Search + Cart ── */}
        <div className={`lg:col-span-3 space-y-4 ${mobilePanel === "invoice" ? "hidden lg:block" : "block"}`}>

          {/* Product Grid */}
          <div className={cardCls}>
            <div className="px-3 sm:px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f]">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
                <input
                  placeholder="Search product by name or imei..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className={`${inputCls} pl-8`}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 max-h-[260px] sm:max-h-[300px] overflow-y-auto">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { addToCart(p); setMobilePanel("invoice"); }}
                  disabled={p.stock === 0}
                  className="flex items-center justify-between p-3 rounded-lg border text-left transition
                    disabled:opacity-40 disabled:cursor-not-allowed
                    border-gray-200 dark:border-[#1f1f1f] hover:border-[#b00000]/40
                    bg-gray-50 dark:bg-[rgba(10,10,10,0.7)]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-gray-900 dark:text-white leading-tight truncate">{p.name}</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">{p.imei}</div>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <div className="text-xs font-bold text-[#b00000] dark:text-[#e05050]">{Rs(p.price)}</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">Qty: {p.stock}</div>
                  </div>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-400 dark:text-gray-600 text-sm">No products found</div>
              )}
            </div>
          </div>

          {/* Cart */}
          <div className={cardCls}>
            <div className="px-3 sm:px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FaShoppingCart size={13} className="text-[#b00000]" /> Cart
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
              </span>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-8 sm:py-10 text-gray-400 dark:text-gray-600 text-sm">No items added yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ minWidth: "480px" }}>
                  <thead>
                    <tr className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-[#1f1f1f]">
                      {["Product","Qty","Unit Price","Discount","Subtotal",""].map((h) => (
                        <th key={h} className={`px-3 sm:px-4 py-2 ${h === "Subtotal" || h === "Unit Price" ? "text-right" : h === "Qty" ? "text-center" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100 dark:border-[#1a1a1a]">
                        <td className="px-3 sm:px-4 py-2">
                          <div className="text-xs font-medium text-gray-900 dark:text-white">{item.name}</div>
                          <div className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{item.imei}</div>
                        </td>
                        <td className="px-3 sm:px-4 py-2">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="w-5 h-5 rounded flex items-center justify-center border border-gray-300 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-400 hover:border-[#b00000] transition"
                            >
                              <FaMinus size={8} />
                            </button>
                            <span className="text-xs font-semibold w-5 text-center text-gray-900 dark:text-white">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="w-5 h-5 rounded flex items-center justify-center border border-gray-300 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-400 hover:border-[#b00000] transition"
                            >
                              <FaPlus size={8} />
                            </button>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-right text-xs text-gray-500 dark:text-gray-300 whitespace-nowrap">{Rs(item.unitPrice)}</td>
                        <td className="px-3 sm:px-4 py-2 text-right">
                          <input
                            type="number"
                            value={item.discount || ""}
                            placeholder="0"
                            onChange={(e) => updateItemDiscount(item.id, e.target.value)}
                            className="w-16 sm:w-20 px-2 py-1 rounded text-xs text-right outline-none transition border focus:border-[#b00000] bg-gray-100 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#1f1f1f] text-gray-900 dark:text-white"
                          />
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-right text-xs font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">{Rs(item.subtotal)}</td>
                        <td className="px-3 sm:px-4 py-2">
                          <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-400 hover:text-red-500 transition">
                            <FaTrash size={10} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Invoice Panel ── */}
        <div className={`lg:col-span-2 space-y-4 ${mobilePanel === "products" ? "hidden lg:block" : "block"}`}>

          {/* Customer Info */}
          <div className={`${cardCls} p-3 sm:p-4 space-y-3`}>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider">Customer</div>
            <input
              placeholder="Customer name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              className={inputCls}
            />
            <input
              placeholder="Cashier name"
              value={customer.cashier}
              onChange={(e) => setCustomer({ ...customer, cashier: e.target.value })}
              className={inputCls}
            />
            <input
              placeholder="Phone number"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              className={inputCls}
            />
          </div>

          {/* Payment Summary */}
          <div className={`${cardCls} p-3 sm:p-4 space-y-3`}>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider">Payment Summary</div>

            {/* Payment method */}
            <div>
              <label className="text-[11px] text-gray-400 dark:text-gray-500 block mb-1">PAYMENT METHOD</label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`py-1.5 rounded-lg text-xs font-medium border transition
                      ${paymentMethod === m
                        ? "border-[#b00000] text-[#b00000] dark:text-[#e05050] bg-[#b00000]/10"
                        : "border-gray-300 dark:border-[#1f1f1f] text-gray-500 bg-gray-50 dark:bg-[#0a0a0a]"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-1">
              {[
                ["Subtotal",       Rs(subtotal),                                                               "text-gray-700 dark:text-gray-300"],
                ["Item Discounts", `- ${Rs(cartItems.reduce((s, i) => s + i.discount, 0))}`,                  "text-yellow-500 dark:text-yellow-400"],
              ].map(([k, v, c]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className={c}>{v}</span>
                </div>
              ))}

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Extra Discount</span>
                <input
                  type="number"
                  placeholder="0"
                  value={globalDiscount || ""}
                  onChange={(e) => setGlobalDiscount(e.target.value)}
                  className="w-24 sm:w-28 px-2 py-1 rounded text-xs text-right outline-none transition border focus:border-[#b00000]
                    bg-gray-100 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#1f1f1f] text-yellow-600 dark:text-yellow-400"
                />
              </div>

              <div className="border-t border-gray-200 dark:border-[#1f1f1f] pt-2 flex justify-between text-sm font-bold">
                <span className="text-gray-900 dark:text-white">Grand Total</span>
                <span className="text-green-600 dark:text-green-400 text-base">{Rs(grandTotal)}</span>
              </div>
            </div>

            {/* Amount paid */}
            <div>
              <label className="text-[11px] text-gray-400 dark:text-gray-500 block mb-1">AMOUNT PAID</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className={inputCls}
              />
            </div>

            {paid > 0 && (
              <div className="flex justify-between text-sm px-3 py-2 rounded-lg border border-green-500/20 bg-green-500/5">
                <span className="text-gray-500">Change</span>
                <span className="text-green-600 dark:text-green-400 font-bold">{Rs(change)}</span>
              </div>
            )}

            <button
              onClick={handleCompleteSale}
              disabled={cartItems.length === 0}
              className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition
                bg-[#b00000] hover:bg-[#8b0000] disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-[#3a0000]"
            >
              <FaCheck size={13} /> Complete Sale
            </button>

            <button
              onClick={clearCart}
              className="w-full py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition border
                border-gray-300 dark:border-[#1f1f1f] text-gray-500 hover:text-red-500 bg-transparent"
            >
              <FaUndo size={11} /> Clear Cart
            </button>
          </div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      {successInvoice && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="w-full max-w-[420px] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
            <div className="h-1 bg-[#b00000]" />
            <div className="px-4 sm:px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <FaCheck size={12} className="text-green-500 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Sale Completed</h2>
                  <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500 mt-0.5">{successInvoice.invoiceNo}</p>
                </div>
              </div>
              <button onClick={() => setSuccessInvoice(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition ml-2">
                <FaTimes />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              <div className="space-y-1">
                {successInvoice.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs py-1 border-b border-gray-100 dark:border-[#1a1a1a]">
                    <span className="text-gray-500 truncate mr-2">{item.name} × {item.qty}</span>
                    <span className="text-gray-900 dark:text-white whitespace-nowrap">{Rs(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 pt-1">
                {[
                  ["Subtotal",    Rs(successInvoice.subtotal),       "text-gray-600 dark:text-gray-300"],
                  ["Discount",    `- ${Rs(successInvoice.discount)}`, "text-yellow-500 dark:text-yellow-400"],
                  ["Grand Total", Rs(successInvoice.grandTotal),     "text-green-600 dark:text-green-400 font-bold text-base"],
                  ["Amount Paid", Rs(successInvoice.amountPaid),     "text-gray-900 dark:text-white"],
                  ["Change",      Rs(successInvoice.change),         "text-green-600 dark:text-green-400"],
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-500">{k}</span>
                    <span className={`${c} whitespace-nowrap ml-2`}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-[#1f1f1f]">
                <span>{successInvoice.date} · {successInvoice.time}</span>
                <span>{successInvoice.paymentMethod}</span>
              </div>
            </div>

            <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => { setSuccessInvoice(null); onViewHistory(); }}
                className="flex-1 py-2 rounded-lg text-sm border border-gray-300 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-transparent transition flex items-center justify-center gap-2"
              >
                <FaReceipt size={11} /> View History
              </button>
              <button
                onClick={() => setSuccessInvoice(null)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-[#b00000] hover:bg-[#8b0000] transition flex items-center justify-center gap-2"
              >
                <FaPlus size={11} /> New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewSale;