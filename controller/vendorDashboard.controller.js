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

    // Find the vendor's balances in the admin data
    const adminData = await adminModel.findOne({});

    if (!adminData || !adminData.vendorBalancesPerDay) {
      return res
        .status(404)
        .json({ message: "Vendor balances not found in admin data" });
    }

    const vendorBalances = adminData.vendorBalancesPerDay.find(
      (balance) => balance.vendorId.toString() === vendorId
    );

    if (!vendorBalances) {
      return res.status(404).json({ message: "Vendor balances not found" });
    }

    // Calculate profit and loss for each day
    const profitLossPerDay = vendorBalances.balancesPerDay.map((balance) => {
      const loss = balance.balance * 0.1; // 10% loss
      const profit = balance.balance - loss;
      return {
        date: balance.date,
        profit,
        loss,
      };
    });

    profitLossPerDay.forEach((entry) => {
      adminData.vendorProfitAndLossPerDay.push({
        vendorId: vendorId,
        date: entry.date,
        profit: entry.profit,
        loss: entry.loss,
      });
    });

    await adminData.save();

    // Sending the response
    res.status(200).json({ profitLossPerDay });
  } catch (error) {
    console.error(
      "Failed to calculate and store profit and loss for vendor:",
      error
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getCustomerCount, vendorProfitLoss };
