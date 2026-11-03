import express from "express";
import {
  createRepair,
  getRepairs,
  updateRepair,
  deleteRepair,
} from "../controllers/repairController.js";
import authAdmin from "../middleware/authAdmin.js";
import verifyAdminPassword from "../middleware/verifyAdminPassword.js";


const repairRouter = express.Router();

repairRouter.use(authAdmin);

repairRouter.post("/create", createRepair);
repairRouter.get("/", getRepairs);
repairRouter.put("/:id", updateRepair);
repairRouter.delete("/:id", verifyAdminPassword, deleteRepair);

export default repairRouter;