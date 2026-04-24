import React from "react";
import { FaTimes } from "react-icons/fa";

const inputCls = "w-full px-3 py-1.5 rounded-lg text-sm border bg-gray-50 dark:bg-[#0a0a0a] border-gray-200 dark:border-[#1f1f1f] text-gray-900 dark:text-white outline-none focus:border-[#b00000] transition placeholder-gray-300 dark:placeholder-gray-700";
const labelCls = "text-[10px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider block mb-1";

const AddRepair = ({ form, setForm, onClose, onSubmit }) => {
  const setHandover = (key, val) =>
    setForm(f => ({ ...f, handover: { ...f.handover, [key]: val } }));

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="w-[780px] max-w-[96vw] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
        <div className="h-[3px]" style={{ background: "#b00000" }} />

        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between bg-gray-50 dark:bg-[#0d0d0d]">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-gray-900 dark:text-white tracking-wide text-sm">
              DEFECTIVE DEVICE COLLECTION FORM
            </h2>
            <span className="text-[10px] font-mono font-bold text-[#b00000] bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-2 py-0.5 rounded">
              {form.collectionNo}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5">

          {/* ── Row 1: Customer (left) + Device (right) ── */}
          <div className="grid grid-cols-2 gap-5 mb-4">

            {/* Customer Information */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-[#1a1a1a] pb-1 mb-2">
                CUSTOMER INFORMATION
              </div>
              <div>
                <label className={labelCls}>NAME *</label>
                <input
                  required
                  placeholder="Customer full name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelCls}>TEL NO 1 *</label>
                  <input
                    required
                    placeholder="07XXXXXXXX"
                    value={form.tel1}
                    onChange={e => setForm(f => ({ ...f, tel1: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>TEL NO 2</label>
                  <input
                    placeholder="Optional"
                    value={form.tel2}
                    onChange={e => setForm(f => ({ ...f, tel2: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Device Information */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-[#1a1a1a] pb-1 mb-2">
                DEVICE INFORMATION
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelCls}>BRAND *</label>
                  <input
                    required
                    placeholder="e.g. Apple"
                    value={form.brand}
                    onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>MODEL *</label>
                  <input
                    required
                    placeholder="e.g. iPhone 13"
                    value={form.model}
                    onChange={e => setForm(f => ({ ...f, model: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>IMEI / SN *</label>
                <input
                  required
                  placeholder="15-digit IMEI or serial number"
                  maxLength={20}
                  value={form.imei}
                  onChange={e => setForm(f => ({ ...f, imei: e.target.value }))}
                  className={`${inputCls} font-mono`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelCls}>PURCHASE DATE</label>
                  <input
                    type="date"
                    value={form.purchaseDate}
                    onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>WARRANTY</label>
                  <div className="flex gap-4 mt-2">
                    {["warranty", "non-warranty"].map(opt => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="warranty"
                          value={opt}
                          checked={form.warranty === opt}
                          onChange={() => setForm(f => ({ ...f, warranty: opt }))}
                          className="accent-[#b00000]"
                        />
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                          {opt === "warranty" ? "Warranty" : "Non Warranty"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 2: Fault (left) + Handover (right) ── */}
          <div className="grid grid-cols-2 gap-5 mb-4">

            {/* Fault Description */}
            <div>
              <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-[#1a1a1a] pb-1 mb-2">
                FAULTY INFORMATION
              </div>
              <label className={labelCls}>FAULTY DESCRIPTION *</label>
              <textarea
                required
                rows="6"
                placeholder="Describe the issue in detail..."
                value={form.faultDescription}
                onChange={e => setForm(f => ({ ...f, faultDescription: e.target.value }))}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Handover Items */}
            <div>
              <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-[#1a1a1a] pb-1 mb-2">
                HANDOVER ITEMS
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-3">
                {[
                  { key: "charger",     label: "Charger"       },
                  { key: "cable",       label: "Cable"         },
                  { key: "backCover",   label: "Back Cover"    },
                  { key: "warrantyCard",label: "Warranty Card" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.handover[key]}
                      onChange={e => setHandover(key, e.target.checked)}
                      className="accent-[#b00000] w-3.5 h-3.5"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className={labelCls}>OTHER</label>
                <input
                  placeholder="Any other items..."
                  value={form.handover.other}
                  onChange={e => setHandover("other", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-[#1a1a1a]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition bg-[#b00000] hover:bg-[#8b0000]"
            >
              Save DC Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRepair;