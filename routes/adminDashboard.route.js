import express from "express";
import { dashboardStatus } from "../controller/controller.js";
import { adminAuthorization } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/status", adminAuthorization, dashboardStatus);

export default router;
