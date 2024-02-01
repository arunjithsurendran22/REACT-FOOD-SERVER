import { adminModel, couponModel } from "../models/model.js";

// POST: add coupon endpoint
const addCoupon = async (req, res, next) => {
  try {
    const { title, percentage, expireDateTime } = req.body;
    const adminId = req.adminId;
    const role = req.role;

    console.log(expireDateTime);
    if (role === "admin" && adminId) {
      try {
        const existingAdmin = await adminModel.findById(adminId);

        if (!existingAdmin) {
          return res.status(404).json({ message: "Vendor not found" });
        }

        // Check if the coupon already exists with the same title
        const existingCoupon = await couponModel.findOne({
          title,
          adminId,
        });

        if (existingCoupon) {
          return res.status(400).json({ message: "Coupon already exists" });
        }

        // Create a new Coupon
        const newCoupon = new couponModel({
          title,
          percentage,
          adminId,
          expireDateTime: expireDateTime,
        });

        await newCoupon.save();
        res.status(201).json(newCoupon);
      } catch (error) {
        console.error("Error in addCoupon:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    next(error);
    console.error("Error in addCoupon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET: get all coupons endpoint
const getAllCoupons = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const role = req.role;

    // Check if the user is authenticated
    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === "admin") {
      try {
        // Fetch all coupons for the specific admin
        const coupons = await couponModel.find({ adminId });

        // Check if the admin has any coupons
        if (coupons.length === 0) {
          return res
            .status(404)
            .json({ message: "No coupons found for this admin" });
        }

        // Check expiration status for each coupon
        const currentDate = new Date();
        const couponsWithExpirationStatus = coupons.map((coupon) => {
          const isExpired = coupon.expireDateTime < currentDate;
          return {
            ...coupon._doc,
            isExpired,
          };
        });

        return res.status(200).json(couponsWithExpirationStatus);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    } else {
      return res.status(403).json({ message: "Forbidden - Access denied" });
    }
  } catch (error) {
    console.error("Error fetching coupons:", error);
    next(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT: update coupon endpoint
const updateCoupon = async (req, res, next) => {
  try {
    const { title, percentage, expireDateTime } = req.body;
    const adminId = req.adminId;
    const role = req.role;
    const couponId = req.params.couponId;

    if (role === "admin" && adminId) {
      try {
        // Check if admin already exists
        const existingAdmin = await adminModel.findById(adminId);

        if (!existingAdmin) {
          return res.status(404).json({ message: "Admin not found" });
        }

        // Find coupon and update
        const updatedCoupon = await couponModel.findOneAndUpdate(
          { _id: couponId, adminId },
          { title, percentage, expireDateTime },
          { new: true, runValidators: true }
        );

        if (!updatedCoupon) {
          return res
            .status(404)
            .json({ message: "Coupon not found or not authorized" });
        }

        return res.status(200).json(updatedCoupon);
      } catch (error) {
        console.error("Error updating coupon:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error updating coupon:", error);
    next(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE: delete coupon endpoint
const deleteCoupon = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const role = req.role;
    const couponId = req.params.couponId;

    if (role === "admin" && adminId) {
      //check if admin already exists
      const existingAdmin = await adminModel.findById(adminId);

      if (!existingAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      //find and delete coupon
      const existingCoupon = await couponModel.findByIdAndDelete(couponId);

      if (!existingCoupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      return res.status(200).json({ message: "Successfully deleted" });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error deleting coupon:", error);
    next(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { addCoupon, getAllCoupons, updateCoupon, deleteCoupon };
