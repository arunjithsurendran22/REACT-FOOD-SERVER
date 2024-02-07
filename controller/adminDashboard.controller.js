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

    const customerCount =await userModel.countDocuments()
    let totalOrders = 0;
    existingUsers.forEach(user => {
      user.orders.forEach(order => {
        totalOrders++;
      });
    });
    res.status(200).json({ totalOrders ,customerCount});

  } catch (error) {
    console.error("Failed to fetch status:", error);
    next(error);
  }
};


export { dashboardStatus };
