import express from "express";
import {
  addToCart,
  viewCart,
  updateQuantity,
  removeCartItem,
  addToFavorites,
  removefromFavorites,
  getAllFavorites,
  selectAddressAddToCart,
  orderPayment,
  validatePayment,
  order,
  orderDetails,
  getCoupon,
  applyCouponCode,
  homePageVendorCard,
  getCategoryVendorCard,
  vendorPage,
  getCategories,
  getAllCategoriesUnique,
  getproductByCategory,
  getAllProducts,
  cancelOrder,
  ratingProduct,
  removeCouponCode,
} from "../controller/controller.js";
import { userAuthenticate } from "../middleware/userAuthMiddleware.js";

const router = express.Router();
//category items
router.get("/add-on-category/get/list", getCategories );
router.get("/add-on-category/get-unique-category/list/:vendorId", getAllCategoriesUnique );
router.get("/add-on-category/get-vendor-List/:categoryId", getCategoryVendorCard )
//product list
router.get("/add-on-product/get/product-list/:vendorId/:categoryId",getproductByCategory );
router.get("/add-on-product/get/product-all-list/:vendorId",  getAllProducts);
//Add to cart
router.get("/cart-items/get/list", userAuthenticate, viewCart);
router.post("/add-to-cart/create/:productId/:vendorId", userAuthenticate, addToCart);
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
router.post("/order-list/cancel-order/:orderId",userAuthenticate , cancelOrder)

//user product rating
router.post("/rating-product/:productId", userAuthenticate , ratingProduct)

//coupons 
router.get("/coupon-list/get", userAuthenticate, getCoupon)
router.post("/coupon-list/apply-coupon/:couponId", userAuthenticate, applyCouponCode)
router.post("/coupon-list/delete-coupon/:couponId", userAuthenticate, removeCouponCode)
//Home page vendor Card
router.get("/vendor-card/get" ,homePageVendorCard)
router.get("/vendor-page/:vendorId", vendorPage)

export default router;
