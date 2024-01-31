import express from "express";
import { vendorAuthenticate } from "../middleware/vendorAuthMiddleware.js";
import { createWorkingHours } from "../controller/controller.js";

const router = express.Router();

router.post("/working-hours/create", vendorAuthenticate, createWorkingHours);

export default router;
