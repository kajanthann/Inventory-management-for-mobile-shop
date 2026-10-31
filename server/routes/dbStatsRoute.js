import express from "express";
import { getDbStats } from "../controllers/dbStatsController.js";
import authAdmin from "../middleware/authAdmin.js";

const DbStatsRouter = express.Router();

DbStatsRouter.use(authAdmin);

// GET /api/db-stats
DbStatsRouter.get("/stats", getDbStats);

export default DbStatsRouter;