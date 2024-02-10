import { adminModel, userModel } from "../models/model.js";

const getCoupon = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Unauthorized
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch admin coupon for the logged-in admin
    const adminData = await adminModel.find();
    if (!adminData) {
      return res.status(404).json({ message: "Admin data not found" });
    }

    // Extract coupons from admin data
    const coupons = adminData[0].coupon;

    res.status(200).json({ message: "Successfully fetched coupons", coupons });
  } catch (error) {
    console.log("Failed to get coupons:", error);
    next(error);
  }
};
const applyCouponCode = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { couponId } = req.params;

    // Unauthorized
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user exists
    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the coupon from the admin data
    const adminData = await adminModel.findOne();
    if (!adminData) {
      return res.status(404).json({ message: "Admin data not found" });
    }

    const coupon = adminData.coupon.id(couponId);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Get the user's cart
    const userCart = existingUser.cartItems[0];

    // Check if the coupon is already applied
    if (userCart.couponCode === coupon.title) {
      return res.status(400).json({ message: "Coupon already applied" });
    }

    // Calculate the discount
    const discountPercentage = coupon.percentage;
    const totalAmount = userCart.grandTotal;
    const discountAmount = (totalAmount * discountPercentage) / 100;
    const discountedTotal = totalAmount - discountAmount;

    // Update the cart with the coupon details and discounted total
    userCart.couponCode = coupon.title;
    userCart.grandTotal = discountedTotal;

    // Save the updated user cart
    await existingUser.save();

    res
      .status(200)
      .json({
        message: "Coupon applied successfully",
        updatedCart: existingUser.cartItems[0],
      });
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeCouponCode = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { couponId } = req.params;

    // Unauthorized
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user exists
    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the user's cart
    const userCart = existingUser.cartItems[0];

    // Check if a coupon is applied
    if (!userCart.couponCode) {
      return res.status(400).json({ message: "No coupon applied" });
    }

    // Remove the applied coupon details
    userCart.couponCode = "";
    userCart.grandTotal = userCart.products.reduce(
      (total, product) => total + product.totalPrice,
      0
    );

    // Save the updated user cart
    await existingUser.save();

    res.json({
      message: "Coupon removed successfully",
      grandTotal: userCart.grandTotal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getCoupon, applyCouponCode, removeCouponCode };
