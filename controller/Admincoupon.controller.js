import { adminModel } from "../models/model.js";

// POST: add coupon endpoint
const addCoupon = async (req, res, next) => {
  try {
    const { title, percentage, expireDateTime } = req.body;
    const adminId = req.adminId;
    const role = req.role;

    if (role === "admin" && adminId) {
      try {
        const existingAdmin = await adminModel.findById(adminId);

        if (!existingAdmin) {
          return res.status(404).json({ message: "Admin not found" });
        }

        // Check if the coupon already exists with the same title
        const existingCoupon = existingAdmin.coupon.find(
          (coupon) => coupon.title === title
        );

        if (existingCoupon) {
          return res.status(400).json({ message: "Coupon already exists" });
        }

        // Create a new Coupon
        const newCoupon = {
          title,
          percentage,
          expireDateTime: new Date(expireDateTime),
        };

        existingAdmin.coupon.push(newCoupon);

        // Save the updated admin document
        await existingAdmin.save();

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
        // Fetch the admin document
        const admin = await adminModel.findById(adminId);

        // Check if the admin exists
        if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
        }

        // Extract the coupons array from the admin document
        const coupons = admin.coupon;

        // Check if the admin has any coupons
        if (coupons.length === 0) {
          return res
            .status(404)
            .json({ message: "No coupons found for this admin" });
        }

        // Send only the coupons array in the response
        return res.status(200).json(coupons);
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

        // Find the coupon within the admin's coupon array
        const couponToUpdate = existingAdmin.coupon.find(
          (coupon) => coupon._id.toString() === couponId
        );

        if (!couponToUpdate) {
          return res
            .status(404)
            .json({ message: "Coupon not found or not authorized" });
        }

        // Update the coupon properties
        couponToUpdate.title = title;
        couponToUpdate.percentage = percentage;
        couponToUpdate.expireDateTime = expireDateTime;

        // Save the changes to the admin document
        await existingAdmin.save();

        return res.status(200).json(couponToUpdate);
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
      try {
        // Check if admin already exists
        const existingAdmin = await adminModel.findById(adminId);

        if (!existingAdmin) {
          return res.status(404).json({ message: "Admin not found" });
        }
        // Find the index of the coupon within the admin's coupon array
        const couponIndex = existingAdmin.coupon.findIndex(
          (coupon) => coupon._id.toString() === couponId
        );

        if (couponIndex === -1) {
          return res.status(404).json({ message: "Coupon not found" });
        }
        // Remove the coupon from the admin's coupon array
        existingAdmin.coupon.splice(couponIndex, 1);
        // Save the changes to the admin document
        await existingAdmin.save();

        return res.status(200).json({ message: "Successfully deleted" });
      } catch (error) {
        console.error("Error deleting coupon:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
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
