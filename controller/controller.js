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
  deleteVendor,
  logoutAdmin,
} from "./adminProfile.controller.js";
//admin profile
export {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAllVendors,
  getAllCustomers,
  deleteVendor,
  logoutAdmin,
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
import { dashboardStatus } from "./adminDashboard.controller.js";
export { dashboardStatus };
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
};
//order
import {
  vendorOrderList,
  updateOrderStatus,
  getUserAddressAndItems,
} from "./vendorOrder.controller.js";
export { vendorOrderList, updateOrderStatus, getUserAddressAndItems };
//vendor dashboard
import { getCustomerCount } from "./vendorDashboard.controller.js";
export { getCustomerCount };

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
} from "./userOrder.controller.js";
//user order details
export { orderDetails, cancelOrder, ratingProduct };

//user coupons
import { getCoupon, applyCouponCode } from "./userCoupon.controller.js";
//coupons
export { getCoupon, applyCouponCode };
//-------------------------------------------------------------------------------------------------
