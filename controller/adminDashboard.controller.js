import { adminModel, userModel } from "../models/model.js";

const dashboardStatus = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const role = req.role;

    if (role !== "admin" || !adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingAdmin = await adminModel.findById(adminId).maxTimeMS(15000);
    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const existingUsers = await userModel.find().maxTimeMS(15000);
    const sales = existingUsers.map((item) => item.orders);
    console.log(sales);
    const customerCount = await userModel.countDocuments();
    let totalOrders = 0;
    existingUsers.forEach((user) => {
      user.orders.forEach((order) => {
        totalOrders++;
      });
    });
    res.status(200).json({ totalOrders, customerCount });
  } catch (error) {
    console.error("Failed to fetch status:", error);
    next(error);
  }
};

///POST:profit calculation
const calculateProfitAndLoss = async (req, res, next) => {
  try {
    const users = await userModel.find();
    const vendors = await vendorModel.find();

    // Initialize total profit for admin and vendors
    let adminProfit = 0;
    let vendorProfits = {};
    let orderBalances = [];

    // Calculate profit for each user's order
    for (const user of users) {
      for (const order of user.orders) {
        // Calculate admin fee (1% of total amount)
        const adminFee = order.totalAmount * 0.1;
        adminProfit += adminFee;

        // Calculate remaining balance for vendor
        const vendorId = order.vendorId;
        const remainingBalance = order.totalAmount - adminFee;

        // Update vendor's profit
        if (!vendorProfits[vendorId]) {
          vendorProfits[vendorId] = 0;
        }
        vendorProfits[vendorId] += remainingBalance;

        // Store order balance information
        orderBalances.push({
          vendorId: vendorId,
          orderId: order._id,
          balanceAmount: remainingBalance,
        });
      }
    }

    // Save admin's profit in the database
    const admin = await adminModel.findOneAndUpdate(
      {},
      { $inc: { profit: adminProfit } },
      { new: true }
    );
    // Save vendor's profits and order balances in the database
    for (const vendorId of Object.keys(vendorProfits)) {
      // Update vendor's profit
      await vendorModel.findByIdAndUpdate(vendorId, {
        $inc: { profit: vendorProfits[vendorId] },
      });

      // Save order balances for the vendor
      const vendorOrderBalances = orderBalances.filter(
        (order) => order.vendorId === vendorId
      );
      await vendorModel.findByIdAndUpdate(vendorId, {
        $push: { orderBalance: { $each: vendorOrderBalances } },
      });
    }

    res.status(200).json({ adminProfit, vendorProfits });
  } catch (error) {
    next(error)
    console.error("Failed to calculate profit and loss:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export { dashboardStatus };
