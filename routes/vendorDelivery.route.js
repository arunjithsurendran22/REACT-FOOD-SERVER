import express from "express";
import { vendorAuthenticate } from "../middleware/vendorAuthMiddleware.js";
import {
  addPincodeDeliveryFee,
  getPincodeDeliveryFee,
  editPincodeDeliveryFee,
  deletePincodeDeliveryFee,
} from "../controller/controller.js";

const router = express.Router();

router.post("/add-pincode/create", vendorAuthenticate, addPincodeDeliveryFee);
router.get("/add-pincode/get", vendorAuthenticate, getPincodeDeliveryFee);
router.put("/add-pincode/edit/:pincodeId", vendorAuthenticate, editPincodeDeliveryFee);
router.delete("/add-pincode/delete/:pincodeId", vendorAuthenticate, deletePincodeDeliveryFee);

export default router;
