import repairModel from "../models/repair.js";


// ✅ CREATE REPAIR
export const createRepair = async (req, res) => {
  try {
    const {
      collectionNo,
      name,
      tel1,
      tel2,
      brand,
      model,
      imei,
      purchaseDate,
      warranty,
      faultDescription,
      handover,
      date,
    } = req.body;

    // ✅ validation (match schema)
    if (
      !collectionNo ||
      !name ||
      !tel1 ||
      !brand ||
      !model ||
      !imei ||
      !faultDescription ||
      !date
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const repair = await repairModel.create({
      collectionNo,
      name,
      tel1,
      tel2,
      brand,
      model,
      imei,
      purchaseDate,
      warranty,
      faultDescription,
      handover,
      date,
      status: "pending",
      price: null,
    });

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



// ✅ GET ALL REPAIRS
export const getRepairs = async (req, res) => {
  try {
    const repairs = await repairModel.find().sort({ createdAt: -1 });

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



// ✅ UPDATE REPAIR
export const updateRepair = async (req, res) => {
  try {
    const { status, price } = req.body;

    const updateData = {
      status,
    };

    // only save price if done
    if (status === "done") {
      updateData.price = price || 0;
    }

    // if returned → no price
    if (status === "returned") {
      updateData.price = null;
    }

    const repair = await repairModel.findByIdAndUpdate(
      req.params.id,
      updateData,
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



// ✅ DELETE REPAIR
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