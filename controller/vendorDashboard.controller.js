import { userModel, vendorModel } from "../models/model.js";


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
        "orders.products.vendorId": vendorId
      });
      console.log(usersWithPurchases);
      // Get the count of customers
      const customerCount = usersWithPurchases.length;

      // Continue with your logic...
      return res.status(200).json({ message: "Success", customerCount });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




export { getCustomerCount };
