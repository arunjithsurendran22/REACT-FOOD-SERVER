import {  userModel } from "../models/model.js";

//GET :get coupon codes
const getCoupon = async (req, res, next) => {
  try {
    const userId = req.userId;

    //Unauthorized
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //checked if user is already exists
    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const coupons = await couponModel.find();
    res.status(200).json({ message: "Successfully fetched coupons", coupons });
  } catch (error) {
    next(error);
    console.log("failed get coupons");
    res.status(500).json({ message: "Internal Server Error" });
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

    // Find the user's cart
    const userCart = await cartModel.findOne({ userId });

    if (!userCart) {
      return res.status(400).json({ message: "User cart not found" });
    }

    // Find the coupon
    const existingCoupon = await couponModel.findById(couponId);

    if (!existingCoupon) {
      return res.json({ message: "Coupon not found" });
    }
    // Get the current grandTotal from the cart schema
    const totalAmount = userCart.grandTotal;

    const couponTitle = existingCoupon.title;

    const cartCouponCode = userCart.couponCode;

    if (cartCouponCode === couponTitle) {
      return res.status(400).json({ message: "Coupon alredy applied" });
    }
    // Calculate the coupon discount
    const discountPercentage = existingCoupon.percentage;
    const discountAmount = (totalAmount * discountPercentage) / 100;
    const discountedTotal = totalAmount - discountAmount;

    // Update the grandTotal in the cart schema
    userCart.grandTotal = discountedTotal;
    userCart.couponCode = couponTitle;
    // Save the changes to the cart
    const savedUserCart = await userCart.save();

    if (savedUserCart) {
      res.json({ message: "Coupon applied successfully", discountedTotal });
    } else {
      res.status(500).json({ message: "Failed to update cart" });
    }
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getCoupon, applyCouponCode };
