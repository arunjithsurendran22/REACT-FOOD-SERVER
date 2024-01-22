import express from "express";
import {
  registerVendor,
  loginVendor,
  vendorProfile,
  updateVendorProfile,
  refreshTokenVendor,
  addVendorAddress,
  logoutVendor,
  vendorCustomers,
} from "../controller/controller.js";
import { vendorAuthenticate } from "../middleware/vendorAuthMiddleware.js";

const router = express.Router();

// vendor profile
router.get("/get-profile", vendorAuthenticate, vendorProfile);
router.post("/update-profile", vendorAuthenticate, updateVendorProfile);
router.post("/add-address", vendorAuthenticate, addVendorAddress);
router.post("/profile-logout",vendorAuthenticate, logoutVendor)

// vendor Authentication: Login and register
router.post("/register", registerVendor);
router.post("/login", loginVendor);

//refresh token
router.post("/refresh-token-vendor", refreshTokenVendor);

//vendors Customers details
router.get("/customers-list/get" ,vendorAuthenticate , vendorCustomers )

export default router;
