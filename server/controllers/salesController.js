import mongoose from "mongoose";
import saleModel    from "../models/Sale.js";
import productModel from "../models/product.js";

// ➤ CREATE SALE + decrement stock
export const createSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const data = req.body;

    if (!data.invoiceNo || !data.items?.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Invoice number and items are required",
      });
    }

    if (data.amountPaid < data.grandTotal) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Amount paid is less than grand total",
      });
    }

    // ── Check stock availability ──────────────────────────────
    for (const item of data.items) {
      const product = await productModel.findById(item.product).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name}`,
        });
      }
      if (product.qty < item.qty) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for: ${product.name} (available: ${product.qty})`,
        });
      }
    }

    // ── Calculate extraTotal from extraItems if not provided ──
    const extraItems = data.extraItems || [];
    const extraTotal = extraItems.reduce((s, e) => s + Number(e.price || 0), 0);

    // ── Save sale ─────────────────────────────────────────────
    const [newSale] = await saleModel.create(
      [
        {
          invoiceNo:     data.invoiceNo,
          date:          data.date,
          time:          data.time,
          customer:      data.customer,
          items:         data.items,
          extraItems,                        // ← save extras
          extraTotal:    data.extraTotal ?? extraTotal,
          paymentMethod: data.paymentMethod,
          subtotal:      data.subtotal,
          discount:      data.discount  || 0,
          tax:           data.tax       || 0,
          grandTotal:    data.grandTotal,
          amountPaid:    data.amountPaid,
          change:        data.change    || 0,
          status:        "completed",
        },
      ],
      { session }
    );

    // ── Decrement stock for each item ─────────────────────────
    const bulkOps = data.items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { qty: -item.qty } },
      },
    }));
    await productModel.bulkWrite(bulkOps, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      sale:    newSale,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
};

// ➤ GET ALL SALES
export const getSales = async (req, res) => {
  try {
    const { search, paymentMethod, date } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { invoiceNo:         { $regex: search, $options: "i" } },
        { "customer.name":   { $regex: search, $options: "i" } },
        { "customer.phone":  { $regex: search, $options: "i" } },
        { "customer.cashier":{ $regex: search, $options: "i" } },
      ];
    }
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (date) {
      const start = new Date(date);
      const end   = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    const sales = await saleModel.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, sales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ➤ GET SINGLE SALE
export const getSaleById = async (req, res) => {
  try {
    const sale = await saleModel.findById(req.params.id);
    if (!sale) return res.status(404).json({ success: false, message: "Sale not found" });
    res.json({ success: true, sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ➤ UPDATE SALE
export const updateSale = async (req, res) => {
  try {
    const updated = await saleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Sale not found" });
    res.json({ success: true, message: "Sale updated", sale: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};