import express from "express";
import {
  createRepair,
  getRepairs,
  updateRepair,
  deleteRepair,
} from "../controllers/repairController.js";

const repairRouter = express.Router();

repairRouter.post("/add", createRepair);
repairRouter.get("/all", getRepairs);
repairRouter.put("/:id", updateRepair);
repairRouter.delete("/:id", deleteRepair);

export default repairRouter;