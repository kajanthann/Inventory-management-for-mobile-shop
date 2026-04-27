import mongoose from "mongoose";
import productModel from "../models/product.js";

// =====================
// ADD PRODUCT
// =====================
export const addProduct = async (req, res) => {
  try {
    const { name, imei, price, cost, qty, description, category } = req.body;

    // ✅ SAFE VALIDATION
    if (!name || !imei || price == null || cost == null || qty == null || !category) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const existingProduct = await productModel.findOne({ imei });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "This IMEI already exists",
      });
    }

    const newProduct = await productModel.create({
      name,
      imei,
      price,
      cost,
      qty,
      description,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });

  } catch (error) {

    // ✅ HANDLE DUPLICATE ERROR
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "IMEI already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// UPDATE PRODUCT
// =====================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ID VALIDATION
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const { name, imei, price, cost, qty, description, category } = req.body;

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { name, imei, price, cost, qty, description, category },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "IMEI already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// DELETE PRODUCT
// =====================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ID VALIDATION
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// GET ALL PRODUCTS
// =====================
export const getProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// GET SINGLE PRODUCT
// =====================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ID VALIDATION
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};