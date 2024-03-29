//importing controller endponits
// ---------------------------------------------------------------------------------
//Admin endpoints
// ---------------------------------------------------------------------------------
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
} from "./adminProfile.controller.js";
//admin profile
export {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAllVendors,
  getAllCustomers,
  blockOrUnblockVendor,
  logoutAdmin,
  userBlock,
  userDelete,
};
import {
  addFoodCategory,
  getFoodCategories,
  updateFoodCategory,
  deleteFoodCategory,
} from "./adminProduct.controller.js";
//admin product
export {
  addFoodCategory,
  getFoodCategories,
  updateFoodCategory,
  deleteFoodCategory,
};
import {
  dashboardStatus,
  calculateProfitAndLoss,
} from "./adminDashboard.controller.js";
export { dashboardStatus, calculateProfitAndLoss };
//add coupon
import {
  addCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} from "./Admincoupon.controller.js";
//coupon
export { addCoupon, getAllCoupons, updateCoupon, deleteCoupon };
import { getAllOrders } from "./adminOrders.controller.js";
export { getAllOrders };
// ---------------------------------------------------------------------------------
//Vendor endpoints
// ---------------------------------------------------------------------------------
//restaurant profile
import {
  registerVendor,
  loginVendor,
  vendorProfile,
  updateVendorProfile,
  refreshTokenVendor,
  addVendorAddress,
  logoutVendor,
  vendorCustomers,
} from "./vendorProfile.controller.js";
//restaurant profile
export {
  registerVendor,
  loginVendor,
  vendorProfile,
  updateVendorProfile,
  refreshTokenVendor,
  addVendorAddress,
  logoutVendor,
  vendorCustomers,
};
//retaurant image controller
import {
  addBackgroundImage,
  getBackgroundImage,
  addLogoImage,
  getLogoImage,
} from "./vendorImage.controller.js";
//restarant image
export { addBackgroundImage, getBackgroundImage, addLogoImage, getLogoImage };
//restaurant product -food category and menu-items
import {
  getAllFoodCategories,
  getAllProductItems,
  getSpecificProductItem,
  addProductItem,
  updateProductItem,
  deleteProductItem,
} from "./vendorProduct.controller.js";
//restaurant product
export {
  getAllFoodCategories,
  getAllProductItems,
  getSpecificProductItem,
  addProductItem,
  updateProductItem,
  deleteProductItem,
};

//customer Profile Auth
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
  logoutUser,
} from "./userProfile.controller.js";
//customer profile
export {
  userRegister,
  userLogin,
  userProfile,
  updateUserProfile,
  addUserProfilePhoto,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserAddresses,
  logoutUser,
};
//order
import {
  vendorOrderList,
  updateOrderStatus,
  getUserAddressAndItems,
} from "./vendorOrder.controller.js";
export { vendorOrderList, updateOrderStatus, getUserAddressAndItems };
//vendor dashboard
import {
  getCustomerCount,
  vendorProfitLoss,
} from "./vendorDashboard.controller.js";
export { getCustomerCount, vendorProfitLoss };

import {
  addPincodeDeliveryFee,
  getPincodeDeliveryFee,
  editPincodeDeliveryFee,
  deletePincodeDeliveryFee,
} from "./vendorDelivery.controller.js";
export {
  addPincodeDeliveryFee,
  getPincodeDeliveryFee,
  editPincodeDeliveryFee,
  deletePincodeDeliveryFee,
};
import { createWorkingHours } from "./vendorSettings.controller.js";
export { createWorkingHours };
// ------------------------------------------------------------------------------------------------------------
//importing :get all products for seeing user
// ---------------------------------------------------------------------------------
import {
  homePageVendorCard,
  getCategoryVendorCard,
  vendorPage,
  getCategories,
  getAllCategoriesUnique,
  getproductByCategory,
  getAllProducts,
} from "./userProduct.controller.js";
export {
  homePageVendorCard,
  getCategoryVendorCard,
  vendorPage,
  getCategories,
  getAllCategoriesUnique,
  getproductByCategory,
  getAllProducts,
};
//cart
import {
  addToCart,
  viewCart,
  updateQuantity,
  removeCartItem,
  selectAddressAddToCart,
  orderPayment,
  validatePayment,
  order,
} from "./userCart.controller.js";
//cart
export {
  addToCart,
  viewCart,
  updateQuantity,
  removeCartItem,
  selectAddressAddToCart,
  orderPayment,
  validatePayment,
  order,
};
//favorites
import {
  addToFavorites,
  removefromFavorites,
  getAllFavorites,
} from "./userFavorites.controller.js";
//favorites
export { addToFavorites, removefromFavorites, getAllFavorites };
//user order details
import {
  orderDetails,
  cancelOrder,
  ratingProduct,
  getUserProductRating,
} from "./userOrder.controller.js";
//user order details
export { orderDetails, cancelOrder, ratingProduct, getUserProductRating };

//user coupons
import {
  getCoupon,
  applyCouponCode,
  removeCouponCode,
} from "./userCoupon.controller.js";
//coupons
export { getCoupon, applyCouponCode, removeCouponCode };
//-------------------------------------------------------------------------------------------------
