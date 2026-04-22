import saleModel from "../models/Sale.js";

// ➤ CREATE SALE
export const createSale = async (req, res) => {
  try {
    const data = req.body;

    if (!data.invoiceNo || !data.items?.length) {
      return res.status(400).json({
        success: false,
        message: "Invoice and items are required",
      });
    }

    const newSale = new saleModel(data);
    await newSale.save();

    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      sale: newSale,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ➤ GET ALL SALES
export const getSales = async (req, res) => {
  try {
    const sales = await saleModel.find().sort({ createdAt: -1 });
    res.json({ success: true, sales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ➤ GET SINGLE SALE
export const getSaleById = async (req, res) => {
  try {
    const sale = await saleModel.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

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
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    res.json({
      success: true,
      message: "Sale updated successfully",
      sale: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

