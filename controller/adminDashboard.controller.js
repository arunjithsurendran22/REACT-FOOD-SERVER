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
    const vendors = await vendorModel.find();

    let vendorBalancePerDay = {};
    let profitAndLossPerDay = {};

    for (const user of users) {
      for (const order of user.orders) {
        const adminFeePerOrder = order.totalAmount * 0.1;
        const remainingBalance = order.totalAmount - adminFeePerOrder;

        const orderDate = new Date(order.createdAt);
        const formattedDate = orderDate.toISOString().split("T")[0];

        if (!profitAndLossPerDay[formattedDate]) {
          profitAndLossPerDay[formattedDate] = {
            date: orderDate,
            profit: 0,
            loss: 0,
          };
        }

        profitAndLossPerDay[formattedDate].profit += remainingBalance;
        profitAndLossPerDay[formattedDate].loss += adminFeePerOrder;

        const vendorId = order.vendorId;
        if (!vendorBalancePerDay[vendorId]) {
          vendorBalancePerDay[vendorId] = {};
        }
        if (!vendorBalancePerDay[vendorId][formattedDate]) {
          vendorBalancePerDay[vendorId][formattedDate] = [];
        }
        vendorBalancePerDay[vendorId][formattedDate].push({
          date: orderDate,
          balance: remainingBalance,
          _id: order._id, // Include order ID if needed
        });
      }
    }

    await adminModel.findByIdAndUpdate(adminId, {
      $set: {
        profitAndLossPerDay: Object.values(profitAndLossPerDay),
      },
    });

    for (const vendorId of Object.keys(vendorBalancePerDay)) {
      const updateResult = await vendorModel.findByIdAndUpdate(vendorId, {
        $push: {
          balancePerDay: {
            $each: Object.entries(vendorBalancePerDay[vendorId]).map(
              ([date, balances]) => ({
                date,
                ...balances,
              })
            ),
          },
        },
      });
      
    }

    console.log(vendorBalancePerDay);
    res.status(200).json({ profitAndLossPerDay, vendorBalancePerDay });
  } catch (error) {
    next(error);
    console.error("Failed to calculate profit and loss:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};




export { dashboardStatus, calculateProfitAndLoss };
