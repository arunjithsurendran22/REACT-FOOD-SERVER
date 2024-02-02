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
} from "./adminProfile.controller.js";
import {
  addFoodCategory,
  getFoodCategories,
} from "./adminProduct.controller.js";
import { dashboardStatus } from "./adminDashboard.controller.js";
//add coupon
import {
  addCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} from "./Admincoupon.controller.js";
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
//retaurant image controller
import {
  addBackgroundImage, getBackgroundImage, addLogoImage, getLogoImage
} from "./vendorImage.controller.js";

//restaurant product -food category and menu-items
import {
  getAllFoodCategories,
  getAllProductItems,
  getSpecificProductItem,
  addProductItem,
  updateProductItem,
  deleteProductItem,
} from "./vendorProduct.controller.js";

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
//order
import {
  vendorOrderList,
  updateOrderStatus,
  getUserAddressAndItems,
} from "./vendorOrder.controller.js";
//vendor dashboard
import { getCustomerCount } from "./vendorDashboard.controller.js";

import {
  addPincodeDeliveryFee,
  getPincodeDeliveryFee,
  editPincodeDeliveryFee,
  deletePincodeDeliveryFee,
} from "./vendorDelivery.controller.js";
import { createWorkingHours } from "./vendorSettings.controller.js";
// ------------------------------------------------------------------------------------------------------------
//importing :get all products for seeing user
// ---------------------------------------------------------------------------------
import {
  userGetAllCategories,
  userGetAllProductItems,
  userGetAllRestaurant,
  homePageVendorCard,
} from "./userProduct.controller.js";
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

//favorites
import {
  addToFavorites,
  removefromFavorites,
  getAllFavorites,
} from "./userFavorites.controller.js";
//user order details
import { orderDetails } from "./userOrder.controller.js";

//user coupons
import { getCoupon,applyCouponCode } from "./userCoupon.controller.js";
//-------------------------------------------------------------------------------------------------
//exporting controller endponits

//Admin endpoints exporting
//admin profile
export {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAllVendors,
  getAllCustomers,
};
//admin product
export { addFoodCategory, getFoodCategories };
export { dashboardStatus };
//coupon
export { addCoupon, getAllCoupons, updateCoupon, deleteCoupon };
// -----------------------------------------------------------
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
//restaurant product
export {
  getAllFoodCategories,
  getAllProductItems,
  getSpecificProductItem,
  addProductItem,
  updateProductItem,
  deleteProductItem,
};
//restarant image
export {
  addBackgroundImage, getBackgroundImage, addLogoImage, getLogoImage
};

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
export { vendorOrderList, updateOrderStatus, getUserAddressAndItems };
export { getCustomerCount };
export {
  addPincodeDeliveryFee,
  getPincodeDeliveryFee,
  editPincodeDeliveryFee,
  deletePincodeDeliveryFee,
};
export { createWorkingHours };
//---------------------------------------------------
//exporting all products for users
export { userGetAllCategories, userGetAllProductItems, userGetAllRestaurant ,homePageVendorCard};
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
export { addToFavorites, removefromFavorites, getAllFavorites };

//user order details
export { orderDetails };
//coupons
export { getCoupon ,applyCouponCode};
