import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAllVendors,
  getAllCustomers,
  deleteVendor,
} from "../controller/controller.js";
import { adminAuthorization } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

//admin Authentication endpoints
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/admin-profile", adminAuthorization, getAdminProfile);
//get all vendors details
router.get("/vendor-profile-get", adminAuthorization, getAllVendors);
router.delete("/vendor-profile-delete/:vendorId",adminAuthorization , deleteVendor)
//get all customers details
router.get("/user-profile/get", adminAuthorization, getAllCustomers);

export default router;
