import express from "express";
import {
  userGetAllCategories,
  userGetAllProductItems,
  addToCart,
  viewCart,
  updateQuantity,
  removeCartItem,
  addToFavorites,
  removefromFavorites,
  getAllFavorites,
  userGetAllRestaurant,
  selectAddressAddToCart,
  orderPayment,
  validatePayment,
  order,
  orderDetails,
  getCoupon,
  applyCouponCode,
  homePageVendorCard,
} from "../controller/controller.js";
import { userAuthenticate } from "../middleware/userAuthMiddleware.js";

const router = express.Router();
//category items
router.get("/add-on-category/get/list", userGetAllCategories);
//product list
router.get("/product-items/get/list", userGetAllProductItems);
router.get("/restaurant/get/list",userGetAllRestaurant)
//cart list
router.get("/cart-items/get/list", userAuthenticate, viewCart);
router.post("/add-to-cart/create/:productId", userAuthenticate, addToCart);
router.put("/add-to-cart/update/:Id",userAuthenticate,updateQuantity)
router.delete("/cart-items-delete/:Id", userAuthenticate,removeCartItem);
//add to favorites
router.post("/add-to-favorites/create/:userId/:productId" ,userAuthenticate, addToFavorites)
router.delete("/add-to-favorites/delete/:userId/:productId", userAuthenticate, removefromFavorites)
router.get("/add-to-favorites/get/list", userAuthenticate, getAllFavorites)
//add to payment
router.post("/select-address/add-to-cart/:addressId", userAuthenticate, selectAddressAddToCart)

//Razor pay
router.post("/order", userAuthenticate, orderPayment)
router.post("/order/validate", userAuthenticate , validatePayment)
router.post("/order/payment",userAuthenticate , order)

//Order details
router.get("/order-list/get",userAuthenticate , orderDetails)

//coupons 
router.get("/coupon-list/get", userAuthenticate, getCoupon)
router.post("/coupon-list/apply-coupon/:couponId", userAuthenticate, applyCouponCode)

//Home page vendor Card
router.get("/vendor-card/get" ,homePageVendorCard)
export default router;
