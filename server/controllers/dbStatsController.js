import mongoose from "mongoose";

export const getDbStats = async (req, res) => {
  try {
    // Check MongoDB connection
    if (
      mongoose.connection.readyState !== 1 ||
      !mongoose.connection.db
    ) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected",
      });
    }

    const db = mongoose.connection.db;

    // Get MongoDB database stats
    const stats = await db.stats();

    // Convert bytes to MB
    const storageSizeMB = Number(
      (stats.storageSize / (1024 * 1024)).toFixed(2)
    );

    const dataSizeMB = Number(
      (stats.dataSize / (1024 * 1024)).toFixed(2)
    );

    const limitMB = 512; // Atlas M0 storage limit

    // Calculate storage usage percentage
    const usagePercent = Number(
      ((storageSizeMB / limitMB) * 100).toFixed(2)
    );

    // Calculate remaining storage
    const freeSpaceMB = Number(
      (limitMB - storageSizeMB).toFixed(2)
    );

    return res.status(200).json({
      success: true,
      dbName: stats.db,
      collections: stats.collections,
      objects: stats.objects,
      dataSizeMB,
      storageSizeMB,
      limitMB,
      usagePercent,
      freeSpaceMB,
    });
  } catch (error) {
    console.error("Failed to get DB stats:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get database statistics",
      error: error.message,
    });
  }
};