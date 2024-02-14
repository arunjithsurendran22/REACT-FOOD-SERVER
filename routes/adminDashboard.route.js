import express from "express";
import { dashboardStatus ,calculateProfitAndLoss } from "../controller/controller.js";
import { adminAuthorization } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/status", adminAuthorization, dashboardStatus);
router.get("/profit-loss",adminAuthorization, calculateProfitAndLoss);

export default router;
