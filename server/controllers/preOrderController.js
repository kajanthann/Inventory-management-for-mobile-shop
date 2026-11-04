import preOrderModel from "../models/preorder.js";

// Delivered + fully paid → completed
const resolveStatus = (order) => {
  if (order.delivered && order.balancePayment <= 0) return "completed";
  if (order.delivered) return "delivered";
  return "pending";
};

// ── CREATE ───────────────────────────────────────────────────────
export const addPreOrder = async (req, res) => {
  try {
    const { customerName, phone, productName, model, price, advancePayment, notes } = req.body;

    if (!customerName || !phone || !productName || !price) {
      return res.status(400).json({
        success: false,
        message: "customerName, phone, productName, and price are required",
      });
    }

    const p = Number(price);
    const a = Number(advancePayment) || 0;

    if (a > p) {
      return res.status(400).json({ success: false, message: "Advance payment cannot exceed total price" });
    }

    const order = await preOrderModel.create({
      customerName,
      phone,
      productName,
      model: model || "",
      date: new Date(),
      price: p,
      advancePayment: a,
      balancePayment: p - a,
      notes: notes || "",
      delivered: false,
      status: "pending",
    });

    res.status(201).json({ success: true, message: "Pre-order added", order });
  } catch (err) {
    console.error("addPreOrder:", err);
    res.status(500).json({ success: false, message: "Failed to add pre-order" });
  }
};

// ── GET ALL ──────────────────────────────────────────────────────
export const getPreOrders = async (req, res) => {
  try {
    const orders = await preOrderModel.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, orders });
  } catch (err) {
    console.error("getPreOrders:", err);
    res.status(500).json({ success: false, message: "Failed to load pre-orders" });
  }
};

// ── GET ONE ──────────────────────────────────────────────────────
export const getPreOrderById = async (req, res) => {
  try {
    const order = await preOrderModel.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ success: false, message: "Pre-order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load pre-order" });
  }
};

// ── MARK DELIVERED ───────────────────────────────────────────────
export const markDelivered = async (req, res) => {
  try {
    const order = await preOrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Pre-order not found" });

    if (order.delivered) {
      return res.status(400).json({ success: false, message: "Already delivered" });
    }

    order.delivered = true;
    order.status = resolveStatus(order); // balance 0 na → completed
    await order.save();

    res.json({
      success: true,
      message: order.status === "completed" ? "Delivered. Order completed!" : "Marked as delivered",
      order,
    });
  } catch (err) {
    console.error("markDelivered:", err);
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

// ── FULL PAYMENT RECEIVED ────────────────────────────────────────
export const markFullPayment = async (req, res) => {
  try {
    const order = await preOrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Pre-order not found" });

    if (order.balancePayment <= 0) {
      return res.status(400).json({ success: false, message: "Balance already paid" });
    }

    order.balancePayment = 0;               // advancePayment maarathu
    order.status = resolveStatus(order);    // delivered na mattum completed
    await order.save();

    res.json({
      success: true,
      message: order.status === "completed"
        ? "Full payment received. Order completed!"
        : "Full payment received. Deliver pannina completed aagum",
      order,
    });
  } catch (err) {
    console.error("markFullPayment:", err);
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

// ── DELETE ───────────────────────────────────────────────────────
export const deletePreOrder = async (req, res) => {
  try {
    const deleted = await preOrderModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Pre-order not found" });
    res.json({ success: true, message: "Pre-order deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};