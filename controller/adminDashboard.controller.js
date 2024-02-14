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
   // Access admin's role

    if (!adminId) {
      return res.status(401).json("Unauthorized");
    }

    const users = await userModel.find();
    const vendors = await vendorModel.find();

    // Initialize an object to store vendor balances per day
    let vendorBalancePerDay = {};

    // Initialize an object to store profit and loss per day
    let profitAndLossPerDay = {};

    // Loop through each user and their orders
    for (const user of users) {
      for (const order of user.orders) {
        // Calculate admin fee (10% of order total)
        const adminFeePerOrder = order.totalAmount * 0.1; // Admin charge per order
        const remainingBalance = order.totalAmount - adminFeePerOrder;

        // Calculate profit or loss for admin per day
        const orderDate = new Date(order.createdAt);
        const formattedDate = orderDate.toISOString().split("T")[0];

        // Initialize profit and loss for the day if not already present
        if (!profitAndLossPerDay[formattedDate]) {
          profitAndLossPerDay[formattedDate] = {
            date: orderDate,
            profit: 0,
            loss: 0,
          };
        }

        // Update profit and loss for the day
        profitAndLossPerDay[formattedDate].profit += remainingBalance;
        profitAndLossPerDay[formattedDate].loss += 5; // Fixed loss amount per order

        // Store balance amount per day for vendor
        const vendorId = order.vendorId;
        if (!vendorBalancePerDay[vendorId]) {
          vendorBalancePerDay[vendorId] = {};
        }
        if (!vendorBalancePerDay[vendorId][formattedDate]) {
          vendorBalancePerDay[vendorId][formattedDate] = 0;
        }
        vendorBalancePerDay[vendorId][formattedDate] += remainingBalance;
      }
    }

    // Save profit and loss per day in the admin model
    await adminModel.findByIdAndUpdate(adminId, {
      $set: {
        profitAndLossPerDay: Object.values(profitAndLossPerDay),
      },
    });

    // Save vendor balances per day
    for (const vendorId of Object.keys(vendorBalancePerDay)) {
      await vendorModel.findByIdAndUpdate(vendorId, {
        $push: {
          balancePerDay: {
            $each: Object.entries(vendorBalancePerDay[vendorId]).map(
              ([date, balance]) => ({ date, balance })
            ),
          },
        },
      });
    }

    res.status(200).json({ profitAndLossPerDay, vendorBalancePerDay });
  } catch (error) {
    next(error);
    console.error("Failed to calculate profit and loss:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};





export { dashboardStatus, calculateProfitAndLoss };
