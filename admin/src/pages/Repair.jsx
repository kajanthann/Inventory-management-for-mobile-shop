import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { FaPlus } from "react-icons/fa";
import RepairList from "../component/RepairList";
import AddRepair from "../component/AddRepair";
import toast from "react-hot-toast";
import { useConfirmToast } from "../hooks/useConfirmToast";
import Loading from "../component/Loading";

const emptyForm = {
  collectionNo: "",
  name: "",
  tel1: "",
  tel2: "",
  brand: "",
  model: "",
  imei: "",
  purchaseDate: "",
  warranty: "non-warranty",
  faultDescription: "",
  handover: {
    charger: false,
    cable: false,
    backCover: false,
    warrantyCard: false,
    other: "",
  },
};

const Repair = () => {
  const { axiosInstance, loading, setLoading } = useContext(AppContext);

  const [repairs, setRepairs] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const confirmToast = useConfirmToast();

  // ── FETCH REPAIRS ─────────────────────────────
  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/api/repairs");

      if (data.success) {
        setRepairs(data.repairs);
      } else {
        toast.error(data.message || "Failed to load repairs");
      }
    } catch (err) {
      toast.error("Server error while fetching repairs");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  // ── STATS ─────────────────────────────
  const pending = repairs.filter((r) => r.status === "pending").length;
  const done = repairs.filter((r) => r.status === "done").length;

  // ── NEXT DC NUMBER ─────────────────────────────
  const nextCollectionNo = () => {
    const nums = repairs
      .map((r) => parseInt(r.collectionNo?.replace("DC-", "") || "0"))
      .filter(Boolean);

    const next = nums.length ? Math.max(...nums) + 1 : 1;
    return `DC-${String(next).padStart(3, "0")}`;
  };

  const handleOpenAdd = () => {
    setForm({ ...emptyForm, collectionNo: nextCollectionNo() });
    setOpen(true);
  };

  // ── CREATE REPAIR ─────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      const payload = {
        ...form,
        date: today,
        status: "pending",
        price: null,
      };

      const { data } = await axiosInstance.post(
        "/api/repairs/create",
        payload
      );

      if (data.success) {
        setRepairs((prev) => [data.repair, ...prev]);
        setForm(emptyForm);
        setOpen(false);
        toast.success("Repair added successfully");
      } else {
        toast.error(data.message || "Failed to add repair");
      }
    } catch (err) {
      toast.error("Error creating repair");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ── DELETE REPAIR ─────────────────────────────
  const handleDelete = async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/api/repairs/${id}`);

      if (data.success) {
        setRepairs((prev) => prev.filter((r) => r._id !== id));
        toast.success("Repair deleted");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Delete failed");
      console.log(err);
    }
  };

  const confirmDelete = (id) => {
  confirmToast("Are you sure you want to delete this repair?", () => {
    handleDelete(id);
  });
};

  // ── UPDATE REPAIR (DONE / RETURNED) ─────────────────────────────
  const handleComplete = async (id, price, status = "done") => {
    try {
      const { data } = await axiosInstance.put(`/api/repairs/${id}`, {
        status,
        price,
      });

      if (data.success) {
        setRepairs((prev) =>
          prev.map((r) => (r._id === id ? data.repair : r))
        );

        toast.success(
          status === "done" ? "Marked as done" : "Returned to customer"
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Update failed");
      console.log(err);
    }
  };

  if (loading) {<Loading />}

  return (
    <div className="text-gray-900 dark:text-white space-y-5">


      {/* ── STATS ── */}
      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Jobs",
            value: repairs.length,
            color: "text-blue-500 dark:text-blue-400",
            border: "border-blue-300 dark:border-blue-500/20",
          },
          {
            label: "Pending",
            value: pending,
            color: "text-yellow-500 dark:text-yellow-400",
            border: "border-yellow-300 dark:border-yellow-500/20",
          },
          {
            label: "Completed",
            value: done,
            color: "text-green-600 dark:text-green-400",
            border: "border-green-300 dark:border-green-500/20",
          },
        ].map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between sm:block border ${s.border} rounded-xl p-4 bg-white/80 dark:bg-[rgba(17,17,17,0.6)]`}
          >
            <div
              className={`text-xs font-semibold uppercase tracking-wider ${s.color} mb-2`}
            >
              {s.label}
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── TOOLBAR ── */}
      <div className="flex justify-end">
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#b00000] hover:bg-[#8b0000]"
        >
          <FaPlus size={11} /> New DC Form
        </button>
      </div>

      {/* ── LIST ── */}
      <RepairList
        repairs={repairs}
        onDelete={confirmDelete}
        onComplete={handleComplete}
      />

      {/* ── ADD FORM ── */}
      {open && (
        <AddRepair
          form={form}
          setForm={setForm}
          onClose={() => setOpen(false)}
          onSubmit={handleAdd}
        />
      )}
    </div>
  );
};

export default Repair;