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
} from "./vendorImage.controller.js";

//restaurant product -food category and menu-items
import {
  getAllCategories,
  updateFoodCategory,
  deleteFoodCategory,
  getAllProductItems,
  getSpecificProductItem,
  addProductItem,
  updateProductItem,
  deleteProductItem,
} from "./vendorProduct.controller.js";
//add coupon
import { addCoupon, getAllCoupons } from "./coupon.controller.js";
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
// ------------------------------------------------------------------------------------------------------------
//importing :get all products for seeing user
// ---------------------------------------------------------------------------------
import {
  userGetAllCategories,
  userGetAllProductItems,
  userGetAllRestaurant,
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
  getAllCategories,
  updateFoodCategory,
  deleteFoodCategory,
  getAllProductItems,
  getSpecificProductItem,
  addProductItem,
  updateProductItem,
  deleteProductItem,
};
//restarant image
export {
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
};
//coupon
export { addCoupon, getAllCoupons };

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
//---------------------------------------------------
//exporting all products for users
export { userGetAllCategories, userGetAllProductItems, userGetAllRestaurant };
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
