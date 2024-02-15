import { adminModel, vendorModel ,userModel } from "../models/model.js";

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

const calculateProfitAndLoss = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const adminData = await adminModel.findById(adminId);

    if (!adminData) {
      return res.status(401).json("Unauthorized");
    }

    const users = await userModel.find();

    let profitAndLossPerDay = {};
    let vendorBalancesPerDay = {};

    for (const user of users) {
      for (const order of user.orders) {
        const adminFeePerOrder = 5; // Platform fee per order
        const adminProfitPercentage = 0.1; // Admin profit percentage
        const adminProfitPerOrder = order.totalAmount * adminProfitPercentage;
        const remainingBalance = order.totalAmount - (adminFeePerOrder + adminProfitPerOrder);

        const orderDate = new Date(order.createdAt);
        const formattedDate = orderDate.toISOString().split("T")[0];

        // Update profit and loss per day
        if (!profitAndLossPerDay[formattedDate]) {
          profitAndLossPerDay[formattedDate] = {
            date: orderDate,
            profit: 0,
            loss: 0,
          };
        }

        profitAndLossPerDay[formattedDate].profit += adminProfitPerOrder;
        profitAndLossPerDay[formattedDate].loss += adminFeePerOrder;

        // Update vendor balance per day
        const vendorId = order.vendorId;
        if (!vendorBalancesPerDay[vendorId]) {
          vendorBalancesPerDay[vendorId] = {};
        }
        if (!vendorBalancesPerDay[vendorId][formattedDate]) {
          vendorBalancesPerDay[vendorId][formattedDate] = 0; // Initialize balance to 0
        }
        vendorBalancesPerDay[vendorId][formattedDate] += remainingBalance; // Update balance with remaining amount
      }
    }

    // Update admin model with profit and loss and vendor balances
    await adminModel.findByIdAndUpdate(adminId, {
      $set: {
        profitAndLossPerDay: Object.values(profitAndLossPerDay),
        vendorBalancesPerDay: Object.entries(vendorBalancesPerDay).map(([vendorId, balancesPerDay]) => ({
          vendorId,
          balancesPerDay: Object.entries(balancesPerDay).map(([date, balance]) => ({
            date,
            balance
          }))
        }))
      },
    });

    res.status(200).json({ profitAndLossPerDay, vendorBalancesPerDay });
  } catch (error) {
    next(error);
    console.error("Failed to calculate profit and loss:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};




export { dashboardStatus, calculateProfitAndLoss };
