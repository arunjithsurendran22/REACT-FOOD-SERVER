import {
  orderModel,
  vendorModel,
  cartModel,
  userModel,
  userAddressModel,
} from "../models/model.js";

// GET: vendor order list
const vendorOrderList = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;

    // Unauthorized
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if vendor exists
    const existVendor = await vendorModel.findById(vendorId);
    if (!existVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    // Find orders by vendorId
    const orderList = await orderModel.find({ vendorId: vendorId });

    const {
      orderId,
      paymentId,
      cartId,
      userId,
      addressId,
      total,
      status,
      createdAt,
    } = orderList[0];

    const cartItems = await cartModel.findById(cartId);
    const userData = await userModel.findById(userId);
    const userAddress = await userAddressModel.findById(addressId);

    const { name, email, mobile } = userData;
    const orderListData = [
      {
        orderId,
        paymentId,
        total,
        status,
        createdAt,
        name,
        email,
        mobile,
      },
    ];

    res.status(200).json({
      message: "Successfully fetched Order List",
      orderListData,
      cartItems,
      userAddress,
    });
  } catch (error) {
    console.error("Failed to fetch order details", error);
    next(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

//POST :update status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId, newStatus } = req.body;
    const vendorId = req.vendorId;
    console.log("order",orderId);
    console.log("status",newStatus);
    // Unauthorized
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if vendor exists
    const existingVendor = await vendorModel.findById(vendorId);

    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Find the orderId and update status
    const updatedOrder = await orderModel.findOneAndUpdate(
      { orderId: orderId },
      { $set: { status: newStatus } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send the updated order in the response
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { vendorOrderList, updateOrderStatus };
