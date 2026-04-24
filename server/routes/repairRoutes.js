import express from "express";
import {
  createRepair,
  getRepairs,
  updateRepair,
  deleteRepair,
} from "../controllers/repairController.js";

const repairRouter = express.Router();

repairRouter.post("/create", createRepair);
repairRouter.get("/", getRepairs);
repairRouter.put("/:id", updateRepair);
repairRouter.delete("/:id", deleteRepair);

export default repairRouter;