import preOrderModel from "../models/preorder.js";

// ── CREATE ────────────────────────────────────────────────────────
export const addPreOrder = async (req, res) => {
  try {
    const {
      customerName, phone, productName, model,
      price, advancePayment, notes,
    } = req.body;

    if (!customerName || !phone || !productName || !price) {
      return res.status(400).json({
        success: false,
        message: "customerName, phone, productName, and price are required",
      });
    }

    if (Number(advancePayment) > Number(price)) {
      return res.status(400).json({
        success: false,
        message: "Advance payment cannot exceed total price",
      });
    }

    const order = await preOrderModel.create({
      customerName,
      phone,
      productName,
      model:          model || "",
      date:           new Date(),   // ← auto set on submit
      price:          Number(price),
      advancePayment: Number(advancePayment) || 0,
      balancePayment: Number(price) - Number(advancePayment || 0),
      notes:          notes || "",
      status:         "pending",
    });

    res.status(201).json({ success: true, message: "Pre-order added", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET ALL ───────────────────────────────────────────────────────
export const getPreOrders = async (req, res) => {
  try {
    const orders = await preOrderModel.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET SINGLE ────────────────────────────────────────────────────
export const getPreOrderById = async (req, res) => {
  try {
    const order = await preOrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Pre-order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── MARK AS DELIVERED ─────────────────────────────────────────────
export const markDelivered = async (req, res) => {
  try {
    const order = await preOrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Pre-order not found" });

    if (order.status !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending orders can be marked delivered" });
    }

    order.status = "delivered";
    await order.save();

    res.json({ success: true, message: "Marked as delivered", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── FULL PAYMENT RECEIVED → mark completed ────────────────────────
export const markFullPayment = async (req, res) => {
  try {
    const order = await preOrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Pre-order not found" });

    if (order.status === "completed") {
      return res.status(400).json({ success: false, message: "Order is already completed" });
    }

    // ✅ Only clear balance and set completed — advancePayment stays unchanged
    order.balancePayment = 0;
    order.status         = "completed";
    await order.save();

    res.json({ success: true, message: "Full payment received, order completed", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE ────────────────────────────────────────────────────────
export const deletePreOrder = async (req, res) => {
  try {
    const deleted = await preOrderModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Pre-order not found" });
    res.json({ success: true, message: "Pre-order deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};