import productModel from "../models/product.js";

export const addProduct = async (req, res) => {
  try {
    const { name, imei, price, cost, qty, description, category } = req.body;

    if (!name || !imei || !price || !cost || !qty || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingProduct = await productModel.findOne({ imei });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "This IMEI product already exists",
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
    res.status(500).json({ success: false, message: error.message });
  }
};


// =====================
// UPDATE PRODUCT
// =====================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // return updated data
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
    res.status(500).json({ success: false, message: error.message });
  }
};


// =====================
// DELETE PRODUCT
// =====================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

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
    res.status(500).json({ success: false, message: error.message });
  }
};


// =====================
// GET ALL PRODUCTS (OPTIONAL BUT USEFUL)
// =====================
export const getProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// =====================
// GET SINGLE PRODUCT (OPTIONAL)
// =====================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

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
    res.status(500).json({ success: false, message: error.message });
  }
};