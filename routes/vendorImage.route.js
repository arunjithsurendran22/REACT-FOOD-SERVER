import express from "express";
import {
  addBanner,
  updateBanner,
  deleteBanner,
  getAllBanners,
  addBackgroundImage,
  getBackgroundImage,
  deleteBackgroundImage,
  addLogoImage,
  getLogoImage,
  deleteLogoImage,
} from "../controller/controller.js";
import { vendorAuthenticate } from "../middleware/vendorAuthMiddleware.js";
import { uploading } from "../multer/multer.js";

const router = express.Router();

//restaurant banner 
router.get("/banners/list", vendorAuthenticate, getAllBanners);
router.post("/banners/create", vendorAuthenticate, uploading, addBanner);
router.put("/banners/update/:bannerId", vendorAuthenticate, uploading, updateBanner);
router.delete("/banners/delete/:bannerId", vendorAuthenticate, uploading, deleteBanner);

//restaurant add backgorund image
router.post("/background-image/add", vendorAuthenticate, uploading, addBackgroundImage);
router.get("/background-image/get",vendorAuthenticate, uploading, getBackgroundImage)
router.delete("/background-image/delete",vendorAuthenticate, uploading, deleteBackgroundImage)
//restaurant add logo-image
router.post("/logo-image/add", vendorAuthenticate, uploading, addLogoImage);
router.get("/logo-image/get",vendorAuthenticate, uploading, getLogoImage)
router.delete("/logo-image/delete",vendorAuthenticate, uploading, deleteLogoImage)

export default router;
