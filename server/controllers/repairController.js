import repairModel from "../models/repair.js";


// CREATE repair
export const createRepair = async (req, res) => {
  try {
    const { device, imei, phone, fault, price } = req.body;

    if (!device || !imei || !phone || !fault) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const repair = await repairModel.create(req.body);

    res.status(201).json({
      success: true,
      repair,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET all repairs
export const getRepairs = async (req, res) => {
  try {
    const repairs = await repairModel
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      repairs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE repair
export const updateRepair = async (req, res) => {
  try {
    const repair = await repairModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Repair not found",
      });
    }

    res.json({
      success: true,
      repair,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE repair
export const deleteRepair = async (req, res) => {
  try {
    const repair = await repairModel.findByIdAndDelete(req.params.id);

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Repair not found",
      });
    }

    res.json({
      success: true,
      message: "Repair deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};