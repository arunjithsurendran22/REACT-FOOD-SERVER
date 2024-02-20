import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAllVendors,
  getAllCustomers,
  blockOrUnblockVendor,
  logoutAdmin,
  userBlock,
  userDelete,
} from "../controller/controller.js";
import { adminAuthorization } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

//admin Authentication endpoints
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/admin-profile", adminAuthorization, getAdminProfile);
//get all vendors details
router.get("/vendor-profile-get", adminAuthorization, getAllVendors);
router.put("/block-or-unblock-vendor/:vendorId",adminAuthorization , blockOrUnblockVendor)
//get all customers details
router.get("/user-profile/get", adminAuthorization, getAllCustomers);

//admin block and unblock the user
router.post("/user/block-unblock/:userId", adminAuthorization, userBlock);
router.post("/delete-user/:userId", adminAuthorization, userDelete);
//logout
router.post("/logout", adminAuthorization, logoutAdmin);
export default router;
