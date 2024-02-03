import { userModel } from "../models/model.js";

//GET :user order list
const orderDetails = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Unauthorized
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user is already exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find user orders
    const userOrders = await orderModel.find({ userId: userId });
    if (!userOrders) {
      return res.status(404).json({ message: "Orders not found for the user" });
    }

    res
      .status(200)
      .json({ message: "Successfully fetched order details", userOrders });
  } catch (error) {
    next(error);
    console.log("Failed to fetch orders", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { orderDetails };
