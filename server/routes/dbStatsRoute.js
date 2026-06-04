import express from "express";
import { getDbStats } from "../controllers/dbStatsController.js";

const DbStatsRouter = express.Router();

// GET /api/db-stats
DbStatsRouter.get("/stats", getDbStats);

export default DbStatsRouter;