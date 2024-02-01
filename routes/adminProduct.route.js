import express from "express";
import {
  addFoodCategory,
  getFoodCategories,
  addCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} from "../controller/controller.js";
import { adminAuthorization } from "../middleware/adminAuthMiddleware.js";
import { uploading } from "../multer/multer.js";

const router = express.Router();

//admin add foodcategories endpoints
router.post("/add-on-category/create",adminAuthorization,uploading,addFoodCategory);
router.get("/food-categories", adminAuthorization, getFoodCategories);

//coupons
router.post("/add-coupon/create", adminAuthorization, addCoupon);
router.get("/add-coupon/get" ,adminAuthorization , getAllCoupons)
router.put("/add-coupon/edit/:couponId",adminAuthorization , updateCoupon)
router.delete("/add-coupon/delete/:couponId" ,adminAuthorization ,deleteCoupon)

export default router;
