import express from "express";
import {
  userRegister,
  userLogin,
  userProfile,
  updateUserProfile,
  addUserProfilePhoto,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserAddresses,
} from "../controller/controller.js";
import { userAuthenticate } from "../middleware/userAuthMiddleware.js";
import { uploading } from "../multer/multer.js";

const router = express.Router();

// User Registration and Login
router.post("/register", userRegister);
router.post("/login", userLogin);

// User Profile Editing
router.get("/get-profile", userAuthenticate, userProfile);
router.put("/update-profile", userAuthenticate, updateUserProfile);

// Profile Photo Upload
router.post("/add-profile-photo", userAuthenticate, uploading, addUserProfilePhoto);

// User Addresses
router.get("/add-address/get", userAuthenticate, getUserAddresses);
router.post("/add-address/add", userAuthenticate, addUserAddress);
router.put("/update-address/:addressId", userAuthenticate, updateUserAddress);
router.delete("/delete-address/:addressId", userAuthenticate, deleteUserAddress);

export default router;
