import { vendorModel } from "../models/model.js";

//GET: get vendor customers count
const getCustomerCount = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const role = req.role;

    if (role === "vendor") {
      // Unauthorized
      if (!vendorId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // Check if vendor already exists
      const existingVendor = await vendorModel.findById(vendorId);

      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      // Get unique customers from the orderModel
      const orderDetails = await orderModel.find({ vendorId: vendorId });

      // Count unique customer IDs
      const uniqueCustomers = new Set();
      orderDetails.forEach((order) => {
        uniqueCustomers.add(order.userId.toString());
      });

      const customerCount = uniqueCustomers.size;

      const orderCount = await orderModel.countDocuments({
        vendorId: vendorId,
      });

      res
        .status(200)
        .json({ customerCount: customerCount, orderCount: orderCount });
    } else {
      return res.status(404).json({ message: "Vendor Role mismatch" });
    }
  } catch (error) {
    next(error);
    console.error("Failed to get customer count:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getCustomerCount };
