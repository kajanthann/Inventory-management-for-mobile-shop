import mongoose from "mongoose";

export const getDbStats = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    // Get MongoDB database stats
    const stats = await db.stats();

    // Convert bytes → MB
    const usedMB = stats.storageSize / (1024 * 1024);
    const dataMB = stats.dataSize / (1024 * 1024);

    const LIMIT_MB = 512; // MongoDB Atlas M0 limit

    const usagePercent = (usedMB / LIMIT_MB) * 100;

    res.json({
      dbName: stats.db,
      collections: stats.collections,
      objects: stats.objects,
      dataSizeMB: Number(dataMB.toFixed(2)),
      storageSizeMB: Number(usedMB.toFixed(2)),
      limitMB: LIMIT_MB,
      usagePercent: Number(usagePercent.toFixed(2)),
      freeSpaceMB: Number((LIMIT_MB - usedMB).toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get DB stats",
      error: error.message,
    });
  }
};