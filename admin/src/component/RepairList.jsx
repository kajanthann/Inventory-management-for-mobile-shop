import React, { useState } from "react";
import {
  FaTools,
  FaTrash,
  FaCheck,
  FaSearch,
  FaTimes,
  FaEye,
  FaClock,
  FaDollarSign,
  FaUndo,
} from "react-icons/fa";
import { useConfirmToast } from "../hooks/useConfirmToast";

const inputCls =
  "w-full px-3 py-1.5 rounded-lg text-sm border bg-gray-50 dark:bg-[#0a0a0a] border-gray-200 dark:border-[#1f1f1f] text-gray-900 dark:text-white outline-none focus:border-[#b00000] transition placeholder-gray-300 dark:placeholder-gray-700";
const labelCls =
  "text-[10px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider block mb-1";

// ── Handover tag ──────────────────────────────────────────────────────────────
const HandoverTag = ({ label, checked }) => (
  <span
    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
      checked
        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
        : "bg-gray-100 dark:bg-white/[0.03] text-gray-400 dark:text-gray-600 border-gray-200 dark:border-[#1f1f1f] line-through"
    }`}
  >
    {label}
  </span>
);

// ── Status badge helper ───────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    done: {
      icon: <FaCheck size={9} />,
      label: "Completed",
      cls: "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20",
    },
    pending: {
      icon: <FaClock size={9} />,
      label: "Pending",
      cls: "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20",
    },
    returned: {
      icon: <FaUndo size={9} />,
      label: "Returned",
      cls: "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
    },
  };
  const s = map[status] || map.pending;
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium flex items-center gap-1 w-fit border ${s.cls}`}
    >
      {s.icon} {s.label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const RepairList = ({ repairs, onDelete, onComplete }) => {
  const [filterPhone, setFilterPhone] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewItem, setViewItem] = useState(null);
  const [priceModal, setPriceModal] = useState(null);
  const [priceInput, setPriceInput] = useState("");

    const confirmToast = useConfirmToast();

  // ── Filtering ─────────────────────────────────────────────────
  const filtered = repairs.filter((r) => {
    const name = r?.name || "";
    const tel1 = r?.tel1 || "";
    const date = r?.date || "";
    const status = r?.status || "";

    return (
      (filterPhone === "" ||
        tel1.includes(filterPhone) ||
        name.toLowerCase().includes(filterPhone.toLowerCase())) &&
      (filterDate === "" || date === filterDate) &&
      (filterStatus === "" || status === filterStatus)
    );
  });

  // ── Open complete modal ───────────────────────────────────────
  const openPriceModal = (r) => {
    setPriceModal(r);
    setPriceInput("");
  };

  // ── Mark as Done (requires price) ────────────────────────────
  const handleMarkDone = (e) => {
    e.preventDefault();
    if (!priceInput) return;

    confirmToast("Mark this repair as DONE?", () => {
      onComplete(priceModal._id, Number(priceInput), "done");
      setPriceModal(null);
      setPriceInput("");
    });
  };

const handleReturn = () => {
  confirmToast("Return this device to customer?", () => {
    onComplete(priceModal._id, null, "returned");
    setPriceModal(null);
    setPriceInput("");
  });
};

  return (
    <>
      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
          <input
            type="text"
            placeholder="Name or phone..."
            value={filterPhone}
            onChange={(e) => setFilterPhone(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-lg text-sm border bg-white dark:bg-[rgba(10,10,10,0.7)] border-gray-200 dark:border-[#1f1f1f] text-gray-900 dark:text-white outline-none focus:border-[#b00000] transition placeholder-gray-400 dark:placeholder-gray-600"
          />
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm border bg-white dark:bg-[rgba(10,10,10,0.7)] border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 outline-none focus:border-[#b00000] transition"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm border bg-white dark:bg-[rgba(10,10,10,0.7)] border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 outline-none focus:border-[#b00000] transition"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
          <option value="returned">Returned</option>
        </select>
        {(filterPhone || filterDate || filterStatus) && (
          <button
            onClick={() => {
              setFilterPhone("");
              setFilterDate("");
              setFilterStatus("");
            }}
            className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition"
          >
            <FaTimes size={12} />
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <FaTools style={{ color: "#b00000" }} size={13} /> Repair Jobs — DC
            Forms
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-[#1f1f1f]">
                {[
                  "DC No",
                  "Customer",
                  "Device",
                  "IMEI / SN",
                  "Date",
                  "Warranty",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-12 text-gray-400 dark:text-gray-600"
                  >
                    No repairs found
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r._id}
                    className="border-t border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold text-[#b00000]">
                        {r.collectionNo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {r.name}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {r.tel1}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {r.brand} {r.model}
                      </div>
                      <div className="text-xs text-gray-400 truncate max-w-[160px]">
                        {r.faultDescription}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">
                      {r.imei}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {r.date}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          r.warranty === "warranty"
                            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                            : "bg-gray-100 dark:bg-white/[0.03] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-[#1f1f1f]"
                        }`}
                      >
                        {r.warranty === "warranty"
                          ? "WARRANTY"
                          : "NON-WARRANTY"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {/* View */}
                        <button
                          onClick={() => setViewItem(r)}
                          className="p-1.5 rounded border border-blue-200 dark:border-blue-500/20 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
                          title="View"
                        >
                          <FaEye size={11} />
                        </button>

                        {/* Complete / Return — only show for pending */}
                        {r.status === "pending" && (
                          <button
                            onClick={() => openPriceModal(r)}
                            className="p-1.5 rounded border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 transition"
                            title="Complete or Return"
                          >
                            <FaCheck size={11} />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => onDelete(r._id)}
                          className="p-1.5 rounded border border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                          title="Delete"
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════ COMPLETE / RETURN MODAL ═══════════ */}
      {priceModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="w-[400px] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
            {/* Top accent bar */}
            <div className="h-[3px] bg-[#b00000]" />

            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Complete Repair
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
                  {priceModal.collectionNo} · {priceModal.brand}{" "}
                  {priceModal.model}
                </p>
              </div>
              <button
                onClick={() => setPriceModal(null)}
                className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Repair details summary */}
            <div className="px-5 pt-4 pb-2 space-y-0">
              {[
                ["Customer", priceModal.name],
                ["Tel", priceModal.tel1],
                ["IMEI / SN", priceModal.imei],
                ["Fault", priceModal.faultDescription],
                [
                  "Warranty",
                  priceModal.warranty === "warranty"
                    ? "Warranty"
                    : "Non Warranty",
                ],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-[#1a1a1a]"
                >
                  <span className="text-gray-400 dark:text-gray-500">{k}</span>
                  <span className="text-gray-900 dark:text-white font-medium font-mono text-right max-w-[220px] truncate">
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Action form ── */}
            <form
              onSubmit={handleMarkDone}
              className="px-5 pb-5 pt-4 space-y-4"
            >
              {/* Repair charge field */}
              <div>
                <label className={labelCls}>
                  REPAIR CHARGE (Rs)
                  <span className="ml-1 text-gray-300 dark:text-gray-600 font-normal normal-case tracking-normal">
                    — required for "Mark as Done", skip for "Return Device"
                  </span>
                </label>
                <div className="relative">
                  <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter repair price (leave empty if returning)"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className={`${inputCls} pl-8`}
                    autoFocus
                  />
                </div>
              </div>

              {/* Two action buttons */}
              <div className="flex gap-3">
                {/* Return Device — no price needed */}
                <button
                  type="button"
                  onClick={handleReturn}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition
                    bg-purple-600 hover:bg-purple-700"
                >
                  <FaUndo size={11} /> Return Device
                </button>

                {/* Mark as Done — price required */}
                <button
                  type="submit"
                  disabled={!priceInput}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition
                    bg-[#b00000] hover:bg-[#8b0000] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FaCheck size={11} /> Mark as Done
                </button>
              </div>

              {/* Cancel link */}
              <button
                type="button"
                onClick={() => setPriceModal(null)}
                className="w-full text-center text-xs text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white transition"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════ VIEW DC FORM MODAL ═══════════ */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="w-[600px] max-w-[96vw] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
            {/* Status-coloured accent bar */}
            <div
              className={`h-[3px] ${
                viewItem.status === "done"
                  ? "bg-green-500"
                  : viewItem.status === "returned"
                    ? "bg-purple-500"
                    : "bg-yellow-400"
              }`}
            />

            {/* Modal header */}
            <div className="px-5 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between bg-gray-50 dark:bg-[#0d0d0d]">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-gray-900 dark:text-white tracking-wide text-sm">
                  DC FORM DETAILS
                </h2>
                <span className="text-[10px] font-mono font-bold text-[#b00000] bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-2 py-0.5 rounded">
                  {viewItem.collectionNo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={viewItem.status} />
                <button
                  onClick={() => setViewItem(null)}
                  className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-5 grid grid-cols-2 gap-5">
              {/* Left: Customer + Fault + Charge */}
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    CUSTOMER INFORMATION
                  </div>
                  <div className="rounded-lg border border-gray-100 dark:border-[#1a1a1a] overflow-hidden">
                    {[
                      ["Name", viewItem.name],
                      ["Tel No 1", viewItem.tel1],
                      ["Tel No 2", viewItem.tel2 || "—"],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between text-sm px-3 py-2 border-b border-gray-100 dark:border-[#1a1a1a] last:border-0"
                      >
                        <span className="text-gray-400 dark:text-gray-500">
                          {k}
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    FAULT DESCRIPTION
                  </div>
                  <div className="rounded-lg border border-gray-100 dark:border-[#1a1a1a] p-3">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {viewItem.faultDescription}
                    </p>
                  </div>
                </div>

                {/* Repair charge — shown for done */}
                {viewItem.status === "done" && (
                  <div className="rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-green-700 dark:text-green-400 font-semibold">
                      Repair Charge
                    </span>
                    <span className="text-lg font-bold text-green-700 dark:text-green-400 font-mono">
                      Rs {Number(viewItem.price).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Returned notice */}
                {viewItem.status === "returned" && (
                  <div className="rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 px-4 py-3 flex items-center gap-2">
                    <FaUndo
                      className="text-purple-500 dark:text-purple-400"
                      size={13}
                    />
                    <span className="text-sm text-purple-700 dark:text-purple-400 font-semibold">
                      Device returned to customer
                    </span>
                  </div>
                )}
              </div>

              {/* Right: Device + Handover */}
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    DEVICE INFORMATION
                  </div>
                  <div className="rounded-lg border border-gray-100 dark:border-[#1a1a1a] overflow-hidden">
                    {[
                      ["Brand", viewItem.brand],
                      ["Model", viewItem.model],
                      ["IMEI / SN", viewItem.imei],
                      ["Purchase Date", viewItem.purchaseDate || "—"],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between text-sm px-3 py-2 border-b border-gray-100 dark:border-[#1a1a1a] last:border-0"
                      >
                        <span className="text-gray-400 dark:text-gray-500">
                          {k}
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium font-mono text-right">
                          {v}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-sm px-3 py-2">
                      <span className="text-gray-400 dark:text-gray-500">
                        Warranty
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          viewItem.warranty === "warranty"
                            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                            : "bg-gray-100 dark:bg-white/[0.03] text-gray-500 border-gray-200 dark:border-[#1f1f1f]"
                        }`}
                      >
                        {viewItem.warranty === "warranty"
                          ? "WARRANTY"
                          : "NON WARRANTY"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    HANDOVER ITEMS
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <HandoverTag
                      label="Charger"
                      checked={viewItem.handover?.charger}
                    />
                    <HandoverTag
                      label="Cable"
                      checked={viewItem.handover?.cable}
                    />
                    <HandoverTag
                      label="Back Cover"
                      checked={viewItem.handover?.backCover}
                    />
                    <HandoverTag
                      label="Warranty Card"
                      checked={viewItem.handover?.warrantyCard}
                    />
                    {viewItem.handover?.other && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold border bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20">
                        Other: {viewItem.handover.other}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RepairList;
