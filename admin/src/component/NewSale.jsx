import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaCheck,
  FaMinus,
  FaUndo,
  FaReceipt,
} from "react-icons/fa";
import toast from "react-hot-toast";

const PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer", "Online"];
const Rs = (v) => `Rs ${Number(v).toLocaleString()}`;

const inputCls =
  "w-full px-3 py-2 rounded-lg text-sm outline-none transition border focus:border-[#b00000] bg-gray-100 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#1f1f1f] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600";
const cardCls =
  "rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm";

// ── Toast style (consistent with Sales.jsx) ───────────────────────
const toastStyle = {
  background: "#1a1a1a",
  color: "#fff",
  border: "1px solid #2a2a2a",
  borderRadius: "10px",
  fontSize: "13px",
};
const warnToast = (msg) =>
  toast(msg, {
    icon: "⚠️",
    style: { ...toastStyle, borderLeft: "3px solid #eab308" },
  });
const errorToast = (msg) =>
  toast.error(msg, {
    style: { ...toastStyle, borderLeft: "3px solid #b00000" },
    iconTheme: { primary: "#b00000", secondary: "#1a1a1a" },
  });

// ── Cart persistence key ──────────────────────────────────────────
const CART_KEY = "smartspider_cart";

const NewSale = ({
  products,
  loadingProducts,
  onSaleComplete,
  onViewHistory,
}) => {
  // ── Restore cart from sessionStorage so refresh keeps items ──
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [productSearch, setProductSearch] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    cashier: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [amountPaid, setAmountPaid] = useState("");
  const [successInvoice, setSuccessInvoice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [mobilePanel, setMobilePanel] = useState("products");
  const [localProducts, setLocalProducts] = useState(products);

  // ✅ Persist cart to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // ✅ Sync cart maxStock when products refresh (stock updated from server)
  useEffect(() => {
    if (products.length === 0) return;
    setCartItems((prev) =>
      prev.map((item) => {
        const fresh = products.find((p) => p._id === item.productId);
        if (!fresh) return item;
        // maxStock = server stock + what this cart is already holding
        return { ...item, maxStock: fresh.qty + item.qty };
      }),
    );
  }, [products]);

  // ── Filtered products — show real-time qty ────────────────────
const filteredProducts = localProducts.filter((p) =>
  p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
  (p.imei || "").toLowerCase().includes(productSearch.toLowerCase())
);


  // ── Cart helpers ──────────────────────────────────────────────
 const addToCart = (product) => {
  const alreadyInCart = cartItems.find((i) => i.productId === product._id);

  const availableQty = product.qty;

  if (availableQty <= 0) {
    return warnToast(`${product.name} is out of stock`);
  }

  // ✅ LIVE UI UPDATE (reduce product qty instantly)
  setLocalProducts((prev) =>
    prev.map((p) =>
      p._id === product._id
        ? { ...p, qty: p.qty - 1 }
        : p
    )
  );

  setCartItems((prev) => {
    const exists = prev.find((i) => i.productId === product._id);

    if (exists) {
      if (exists.qty >= exists.maxStock) {
        warnToast(`Only ${exists.maxStock} units available`);
        return prev;
      }

      const newQty = exists.qty + 1;

      return prev.map((i) =>
        i.productId === product._id
          ? {
              ...i,
              qty: newQty,
              subtotal: newQty * i.unitPrice - i.discount,
            }
          : i
      );
    }

    return [
      ...prev,
      {
        productId: product._id,
        name: product.name,
        imei: product.imei || "",
        qty: 1,
        unitPrice: product.price,
        discount: 0,
        subtotal: product.price,
        maxStock: product.qty,
      },
    ];
  });
};

  const updateQty = (productId, delta) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.productId !== productId) return i;
        const newQty = i.qty + delta;
        if (newQty < 1) return i;
        if (newQty > i.maxStock) {
          warnToast(`Only ${i.maxStock} units available`);
          return i;
        }
        return {
          ...i,
          qty: newQty,
          subtotal: newQty * i.unitPrice - i.discount,
        };
      }),
    );
  };

  const updateItemDiscount = (productId, val) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? {
              ...i,
              discount: Number(val) || 0,
              subtotal: Math.max(0, i.qty * i.unitPrice - (Number(val) || 0)),
            }
          : i,
      ),
    );
  };

  const removeFromCart = (productId) =>
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));

  const clearCart = () => {
    setCartItems([]);
    setGlobalDiscount(0);
    setAmountPaid("");
    sessionStorage.removeItem(CART_KEY);
  };

  // ── Totals ────────────────────────────────────────────────────
  const subtotal = cartItems.reduce((s, i) => s + i.subtotal, 0);
  const discount = Number(globalDiscount) || 0;
  const grandTotal = Math.max(0, subtotal - discount);
  const paid = Number(amountPaid) || 0;
  const change = Math.max(0, paid - grandTotal);

  // ── Complete sale ─────────────────────────────────────────────
  const handleCompleteSale = async () => {
  if (cartItems.length === 0) return errorToast("Cart is empty");
  if (paid < grandTotal)
    return errorToast("Amount paid is less than grand total");
  if (submitting) return;

  // ✅ REQUIRED FIELDS CHECK
  if (!customer.name.trim()) {
    return errorToast("Customer name is required");
  }

  if (!customer.cashier.trim()) {
    return errorToast("Cashier name is required");
  }

  if (!customer.phone.trim()) {
    return errorToast("Phone number is required");
  }

  setSubmitting(true);

  const invoiceData = {
    customer: { ...customer },
    items: [...cartItems],
    paymentMethod,
    subtotal,
    discount,
    grandTotal,
    amountPaid: paid,
    change,
    status: "completed",
  };

  const result = await onSaleComplete(invoiceData);

  if (result?.success) {
    const invoice = {
      ...invoiceData,
      invoiceNo: result.sale.invoiceNo,
      date: result.sale.date,
      time: result.sale.time,
    };

    setSuccessInvoice(invoice);

    clearCart();
    setCustomer({ name: "", cashier: "", phone: "" });
    setProductSearch("");
    setMobilePanel("products");
  }

  setSubmitting(false);
};

  // ── After modal "New Sale" button: fire the toast ─────────────
  const handleNewSale = () => {
    const inv = successInvoice;
    setSuccessInvoice(null);

    // ✅ Toast fires AFTER modal closes
    toast.success(`Sale ${inv.invoiceNo} saved successfully!`, {
      style: {
        background: "#1a1a1a",
        color: "#fff",
        border: "1px solid #2a2a2a",
        borderLeft: "3px solid #22c55e",
        borderRadius: "10px",
        fontSize: "13px",
      },
      iconTheme: { primary: "#22c55e", secondary: "#1a1a1a" },
      duration: 4000,
    });
  };

  const handleViewHistory = () => {
    const inv = successInvoice;
    setSuccessInvoice(null);

    toast.success(`Sale ${inv.invoiceNo} saved successfully!`, {
      style: {
        background: "#1a1a1a",
        color: "#fff",
        border: "1px solid #2a2a2a",
        borderLeft: "3px solid #22c55e",
        borderRadius: "10px",
        fontSize: "13px",
      },
      iconTheme: { primary: "#22c55e", secondary: "#1a1a1a" },
      duration: 4000,
    });

    onViewHistory();
  };

  return (
    <>
      {/* ── Mobile panel toggle ── */}
      <div className="flex lg:hidden gap-1 p-1 rounded-xl border border-gray-200 dark:border-[#1f1f1f] w-fit bg-gray-100 dark:bg-[rgba(10,10,10,0.6)]">
        {[
          { key: "products", label: "Products & Cart" },
          {
            key: "invoice",
            label: `Invoice${cartItems.length > 0 ? ` (${cartItems.length})` : ""}`,
          },
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => setMobilePanel(p.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
              ${
                mobilePanel === p.key
                  ? "bg-[#b00000] text-white"
                  : "bg-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4">
        {/* ── Left: Products + Cart ── */}
        <div
          className={`lg:col-span-3 space-y-4 ${mobilePanel === "invoice" ? "hidden lg:block" : "block"}`}
        >
          {/* Product Grid */}
          <div className={cardCls}>
            <div className="px-3 sm:px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
                <input
                  placeholder="Search product by name or IMEI..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className={`${inputCls} pl-8`}
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {filteredProducts.length} items
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 max-h-[260px] sm:max-h-[300px] overflow-y-auto">
              {loadingProducts ? (
                [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] animate-pulse"
                  />
                ))
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
                  No products found
                </div>
              ) : (
                filteredProducts.map((p) => {
                  const inCart = cartItems.find((c) => c.productId === p._id);
                  // ✅ Show real server qty (product list always reflects server state)
                  const displayQty = p.qty;
                  const isLow = displayQty > 0 && displayQty <= 5;
                  const isOut = displayQty === 0;

                  return (
                    <button
                      key={p._id}
                      onClick={() => {
                        addToCart(p);
                        setMobilePanel("invoice");
                      }}
                      disabled={isOut}
                      style={{
                        borderColor: inCart ? "rgba(176,0,0,0.5)" : undefined,
                      }}
                      className="flex items-start justify-between p-3 rounded-lg border text-left transition
                        disabled:opacity-40 disabled:cursor-not-allowed
                        border-gray-200 dark:border-[#1f1f1f] hover:border-[#b00000]/40
                        bg-gray-50 dark:bg-[rgba(10,10,10,0.7)]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-gray-900 dark:text-white leading-tight truncate">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5 truncate">
                          {p.imei || p.category || ""}
                        </div>
                        {inCart && (
                          <div className="text-[10px] text-[#b00000] dark:text-[#e05050] mt-0.5 font-medium">
                            {inCart.qty} in cart
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <div className="text-xs font-bold text-[#b00000] dark:text-[#e05050]">
                          {Rs(p.price)}
                        </div>
                        {/* ✅ Real-time qty display */}
                        <div
                          className={`text-[10px] font-mono mt-0.5 ${
                            isOut
                              ? "text-red-500"
                              : isLow
                                ? "text-yellow-500"
                                : "text-gray-400 dark:text-gray-500"
                          }`}
                        >
                          {isOut
                            ? "Out of stock"
                            : isLow
                              ? `Low: ${displayQty}`
                              : `Qty: ${displayQty}`}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Cart */}
          <div className={cardCls}>
            <div className="px-3 sm:px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FaShoppingCart size={13} className="text-[#b00000]" /> Cart
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                </span>
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-400 hover:text-red-500 transition flex items-center gap-1"
                  >
                    <FaTimes size={10} /> Clear
                  </button>
                )}
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-8 sm:py-10 text-gray-400 dark:text-gray-600 text-sm">
                No items added yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ minWidth: "480px" }}>
                  <thead>
                    <tr className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-[#1f1f1f]">
                      {[
                        "Product",
                        "Qty",
                        "Unit Price",
                        "Discount",
                        "Subtotal",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-3 sm:px-4 py-2 ${
                            h === "Subtotal" || h === "Unit Price"
                              ? "text-right"
                              : h === "Qty"
                                ? "text-center"
                                : "text-left"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={item.productId}
                        className="border-t border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-white/[0.01]"
                      >
                        <td className="px-3 sm:px-4 py-2">
                          <div className="text-xs font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </div>
                          {item.imei && (
                            <div className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                              {item.imei}
                            </div>
                          )}
                          <div className="text-[10px] text-gray-400 dark:text-gray-500">
                            Max: {item.maxStock}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => updateQty(item.productId, -1)}
                              className="w-5 h-5 rounded flex items-center justify-center border border-gray-300 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-400 hover:border-[#b00000] hover:text-red-500 transition"
                            >
                              <FaMinus size={8} />
                            </button>
                            <span className="text-xs font-semibold w-5 text-center text-gray-900 dark:text-white">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.productId, 1)}
                              disabled={item.qty >= item.maxStock}
                              className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                                item.qty >= item.maxStock
                                  ? "border-gray-200 dark:border-[#1f1f1f] text-gray-300 dark:text-gray-700 cursor-not-allowed"
                                  : "border-gray-300 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-400 hover:border-[#b00000] hover:text-green-500"
                              }`}
                            >
                              <FaPlus size={8} />
                            </button>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-right text-xs text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {Rs(item.unitPrice)}
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-right">
                          <input
                            type="number"
                            value={item.discount || ""}
                            placeholder="0"
                            min="0"
                            onChange={(e) =>
                              updateItemDiscount(item.productId, e.target.value)
                            }
                            className="w-16 sm:w-20 px-2 py-1 rounded text-xs text-right outline-none transition border focus:border-[#b00000] bg-gray-100 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#1f1f1f] text-gray-900 dark:text-white"
                          />
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-right text-xs font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">
                          {Rs(item.subtotal)}
                        </td>
                        <td className="px-3 sm:px-4 py-2">
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-1 text-gray-400 hover:text-red-500 transition"
                          >
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
        <div
          className={`lg:col-span-2 space-y-4 ${mobilePanel === "products" ? "hidden lg:block" : "block"}`}
        >
          {/* Customer */}
          <div className={`${cardCls} p-3 sm:p-4 space-y-3`}>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Customer
            </div>
            <input
              placeholder="Customer name"
              value={customer.name}
              required
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
              className={inputCls}
            />
            <input
              placeholder="Cashier name"
              value={customer.cashier}
              required
              onChange={(e) =>
                setCustomer({ ...customer, cashier: e.target.value })
              }
              className={inputCls}
            />
            <input
              placeholder="Phone number"
              value={customer.phone}
              required
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
              className={inputCls}
            />
          </div>

          {/* Payment Summary */}
          <div className={`${cardCls} p-3 sm:p-4 space-y-3`}>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Payment Summary
            </div>

            <div>
              <label className="text-[11px] text-gray-400 dark:text-gray-500 block mb-1">
                PAYMENT METHOD
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`py-1.5 rounded-lg text-xs font-medium border transition
                      ${
                        paymentMethod === m
                          ? "border-[#b00000] text-[#b00000] dark:text-[#e05050] bg-[#b00000]/10"
                          : "border-gray-300 dark:border-[#1f1f1f] text-gray-500 bg-gray-50 dark:bg-[#0a0a0a]"
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {Rs(subtotal)}
                </span>
              </div>
              {cartItems.some((i) => i.discount > 0) && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Item Discounts</span>
                  <span className="text-yellow-500 dark:text-yellow-400">
                    - {Rs(cartItems.reduce((s, i) => s + i.discount, 0))}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Extra Discount</span>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={globalDiscount || ""}
                  onChange={(e) => setGlobalDiscount(e.target.value)}
                  className="w-24 sm:w-28 px-2 py-1 rounded text-xs text-right outline-none transition border focus:border-[#b00000]
                    bg-gray-100 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#1f1f1f] text-yellow-600 dark:text-yellow-400"
                />
              </div>
              <div className="border-t border-gray-200 dark:border-[#1f1f1f] pt-2 flex justify-between text-sm font-bold">
                <span className="text-gray-900 dark:text-white">
                  Grand Total
                </span>
                <span className="text-green-600 dark:text-green-400 text-base">
                  {Rs(grandTotal)}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-gray-400 dark:text-gray-500 block mb-1">
                AMOUNT PAID
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                min="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className={inputCls}
              />
            </div>

            {paid > 0 && grandTotal > 0 && (
              <div
                className={`flex justify-between text-sm px-3 py-2 rounded-lg border ${
                  paid < grandTotal
                    ? "border-red-500/20 bg-red-500/5"
                    : "border-green-500/20 bg-green-500/5"
                }`}
              >
                <span className="text-gray-500">
                  {paid < grandTotal ? "Remaining" : "Change"}
                </span>
                <span
                  className={`font-bold ${paid < grandTotal ? "text-red-500" : "text-green-600 dark:text-green-400"}`}
                >
                  {paid < grandTotal
                    ? `- ${Rs(grandTotal - paid)}`
                    : Rs(change)}
                </span>
              </div>
            )}

            <button
              onClick={handleCompleteSale}
              disabled={cartItems.length === 0 || submitting}
              className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition
                bg-[#b00000] hover:bg-[#8b0000] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaCheck size={13} /> Complete Sale
                </>
              )}
            </button>

            <button
              onClick={clearCart}
              disabled={submitting}
              className="w-full py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition border
                border-gray-300 dark:border-[#1f1f1f] text-gray-500 hover:text-red-500 bg-transparent disabled:opacity-40"
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
                  <FaCheck
                    size={12}
                    className="text-green-500 dark:text-green-400"
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Sale Completed
                  </h2>
                  <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500 mt-0.5">
                    {successInvoice.invoiceNo}
                  </p>
                </div>
              </div>
              {/* ✅ X closes modal and fires toast */}
              <button
                onClick={handleNewSale}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition ml-2"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3 max-h-[55vh] overflow-y-auto">
              <div className="space-y-1">
                {successInvoice.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs py-1 border-b border-gray-100 dark:border-[#1a1a1a]"
                  >
                    <span className="text-gray-500 truncate mr-2">
                      {item.name} × {item.qty}
                    </span>
                    <span className="text-gray-900 dark:text-white whitespace-nowrap">
                      {Rs(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 pt-1">
                {[
                  [
                    "Subtotal",
                    Rs(successInvoice.subtotal),
                    "text-gray-600 dark:text-gray-300",
                  ],
                  [
                    "Discount",
                    `- ${Rs(successInvoice.discount)}`,
                    "text-yellow-500 dark:text-yellow-400",
                  ],
                  [
                    "Grand Total",
                    Rs(successInvoice.grandTotal),
                    "text-green-600 dark:text-green-400 font-bold text-base",
                  ],
                  [
                    "Amount Paid",
                    Rs(successInvoice.amountPaid),
                    "text-gray-900 dark:text-white",
                  ],
                  [
                    "Change",
                    Rs(successInvoice.change),
                    "text-green-600 dark:text-green-400",
                  ],
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-500">{k}</span>
                    <span className={`${c} whitespace-nowrap ml-2`}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-[#1f1f1f]">
                <span>
                  {successInvoice.date} · {successInvoice.time}
                </span>
                <span>{successInvoice.paymentMethod}</span>
              </div>
            </div>

            <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* ✅ Toast fires AFTER modal closes */}
              <button
                onClick={handleViewHistory}
                className="flex-1 py-2 rounded-lg text-sm border border-gray-300 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-transparent transition flex items-center justify-center gap-2"
              >
                <FaReceipt size={11} /> View History
              </button>
              <button
                onClick={handleNewSale}
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
