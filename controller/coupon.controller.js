import { couponModel, vendorModel } from "../models/model.js";

// POST: add coupon endpoint
const addCoupon = async (req, res ,next) => {
  try {
    const { title, value } = req.body;
    const vendorId = req.userId;
    const role = req.role;

    // Check if the user is authenticated
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (role === "vendor") {
      const existingVendor = await vendorModel.findById(vendorId);
      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      } else {
        // Check if the coupon already exists with the same title
        const existingCoupon = await couponModel.findOne({
          title,
          vendorId: vendorId,
        });
        if (existingCoupon) {
          return res.status(400).json({ message: "Coupon already exists" });
        } else {
          // Create a new Coupon
          const newCoupon = new couponModel({
            title,
            value,
            vendorId: vendorId,
          });
          await newCoupon.save();
          res.status(200).json(newCoupon);
        }
      }
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    next(error)
    console.error("Error in addCoupon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET: get all coupons endpoint
const getAllCoupons = async (req, res ,next) => {
  try {
    const vendorId = req.userId;
    const role = req.role;

    // Check if the user is authenticated
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (role === "vendor") {
      // Fetch all coupons
      const coupons = await couponModel.find({ vendorId: vendorId });
      return res.status(200).json(coupons);
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    next(error)
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addCoupon, getAllCoupons };
