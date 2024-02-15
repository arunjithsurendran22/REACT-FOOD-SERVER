import { adminModel, userModel, vendorModel } from "../models/model.js";

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

      // Find users who have made purchases from this vendor
      const usersWithPurchases = await userModel.find({
        "orders.products.vendorId": vendorId,
      });
      // Get the count of customers
      const customerCount = usersWithPurchases.length;

      return res.status(200).json({ message: "Success", customerCount });
    }
  } catch (error) {
    next(error);
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const vendorProfitLoss = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;

    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingVendor = await vendorModel.findById(vendorId);

    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Retrieve admin data (assuming you'll use it for investment calculation)
    const adminData = await adminModel.find();

    if (!adminData || adminData.length === 0) {
      return res.status(404).json({ message: "Admin data not found" });
    }

    

    res.status(200).json({ message: "Profit and loss calculated successfully" });
  } catch (error) {
    console.error("Failed to calculate profit and loss for vendor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




export { getCustomerCount, vendorProfitLoss };
