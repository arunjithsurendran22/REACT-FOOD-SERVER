import express from "express";
import {
  addBackgroundImage,
  getBackgroundImage,
  addLogoImage,
  getLogoImage,
} from "../controller/controller.js";
import { vendorAuthenticate } from "../middleware/vendorAuthMiddleware.js";
import { uploading } from "../multer/multer.js";

const router = express.Router();

//restaurant add backgorund image
router.post("/background-image/add",vendorAuthenticate,uploading,addBackgroundImage);
router.get("/background-image/get",vendorAuthenticate,uploading,getBackgroundImage);

//restaurant add logo-image
router.post("/logo-image/add", vendorAuthenticate, uploading, addLogoImage);
router.get("/logo-image/get", vendorAuthenticate, uploading, getLogoImage);

export default router;
