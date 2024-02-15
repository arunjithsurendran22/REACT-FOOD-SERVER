import express from "express";
import { getCustomerCount ,vendorProfitLoss } from "../controller/controller.js";
import { vendorAuthenticate } from "../middleware/vendorAuthMiddleware.js";

const router = express.Router();

//get vendor customers count
router.get("/customers-count", vendorAuthenticate, getCustomerCount);
router.get("/profit-loss", vendorAuthenticate, vendorProfitLoss);
export default router;
