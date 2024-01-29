import { adminModel, orderModel, userModel } from "../models/model.js";

const dashboardStatus = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const role = req.role;

    if (role !== "admin" || !adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingAdmin = await adminModel.findById(adminId);
    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const customerCount = await userModel.countDocuments();
    const orderCount = await orderModel.countDocuments();

    res.status(200).json({ customerCount, orderCount });
  } catch (error) {
    console.error("Failed to fetch status:", error);
    next(error);
  }
};

export { dashboardStatus };
