import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAllVendors,
} from "../controller/controller.js";
import { adminAuthorization } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

//admin Authentication endpoints
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/admin-profile", adminAuthorization, getAdminProfile);
router.get("/vendor-profile-get", adminAuthorization, getAllVendors);

export default router;
