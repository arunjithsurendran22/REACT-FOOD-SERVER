import express from "express";
import {
  addFoodCategory,
  getAllCategories,
  updateFoodCategory,
  deleteFoodCategory,
  getAllProductItems,
  addProductItem,
  updateProductItem,
  deleteProductItem,
  addCoupon,
  getAllCoupons,
  addPincodeAndDeliveryFee,
  updateDeliveryFee,
  getAllPincode,
  vendorOrderList,
  updateOrderStatus,
  getSpecificProductItem,
  getUserAddressAndItems,

} from "../controller/controller.js";
import { vendorAuthenticate } from "../middleware/vendorAuthMiddleware.js";
import { uploading } from "../multer/multer.js";

const router = express.Router();

// Restaurant: Add Food Category
router.get("/add-on-category/get/list", vendorAuthenticate, getAllCategories);
router.post("/add-on-category/create/", vendorAuthenticate, uploading, addFoodCategory);
router.put("/add-on-category/update/:categoryId", vendorAuthenticate, uploading, updateFoodCategory);
router.delete("/add-on-category/delete/:categoryId", vendorAuthenticate, uploading, deleteFoodCategory);

// Restaurant: Menu Item
router.get("/add-on-item/get/list", vendorAuthenticate,  getAllProductItems );
router.get("/add-on-item/get/specific-product/:productId",vendorAuthenticate, getSpecificProductItem)
router.post("/add-on-item/create/:categoryId", vendorAuthenticate, uploading, addProductItem);
router.put("/add-on-item/update/:productId", vendorAuthenticate, uploading, updateProductItem);
router.delete("/add-on-item/delete/:productId", vendorAuthenticate, uploading, deleteProductItem);

// Restaurant: Coupon
router.post("/coupons/create", vendorAuthenticate, addCoupon);
router.get("/coupons/list", vendorAuthenticate, getAllCoupons);

//addPincode for delivery area
router.post("/add-delivery-pincode/create", vendorAuthenticate, addPincodeAndDeliveryFee)
router.put("/add-delivery-pincode/update/:pincodeId", vendorAuthenticate, updateDeliveryFee)
router.get("/add-delivery-pincode/get/list", vendorAuthenticate, getAllPincode)

//order list
router.get("/orders-list/get", vendorAuthenticate ,vendorOrderList )
router.post("/update-order-status",vendorAuthenticate,updateOrderStatus)
router.get("/orders-list/address-products/get/:orderId" ,vendorAuthenticate , getUserAddressAndItems)


export default router;
