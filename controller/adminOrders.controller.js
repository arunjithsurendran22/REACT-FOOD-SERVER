import { adminModel, userModel, vendorModel } from "../models/model.js";

//GET:all orders list
const getAllOrders = async (req, res, next) => {
  try {
    const adminId = req.adminId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingAdmin = await adminModel.findById(adminId);

    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const users = await userModel.find();

    const ordersWithNames = [];

    for (const user of users) {
      for (const order of user.orders) {
        const vendor = await vendorModel.findById(order.vendorId);
        const vendorName = vendor ? vendor.name : "Vendor Not Found";

        const userObject = await userModel.findById(order.userId);
        const userName = userObject ? userObject.name : "User Not Found";

        const orderWithNames = {
          orderId: order.orderId,
          vendorId: order.vendorId,
          vendorName: vendorName,
          paymentId: order.paymentId,
          userId: order.userId,
          userName: userName,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt,
        };

        ordersWithNames.push(orderWithNames);
      }
    }
    res.status(200).json(ordersWithNames);
  } catch (error) {
    next(error);
    console.error("Failed to get all orders", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllOrders };
