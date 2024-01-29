import {
  orderModel,
  vendorModel,
  cartModel,
  userModel,
  userAddressModel,
  productModel,
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

    res.status(200).json({
      message: "Successfully fetched Order List",
      orderList,
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
    console.log(updatedOrder);

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Update product quantities if order status is "Delivered"
    if (newStatus === "Delivered") {
      for (const item of updatedOrder.cartItems) {
        const product = await productModel.findById(item.productId);
        if (product) {
          product.quantity -= item.quantity;
          if (product.quantity <= 0) {
            product.inStock = false;
          }
          await product.save();
        }
      }
    }

    // Send the updated order in the response
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//GET :user Address and products
const getUserAddressAndItems = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const vendorId = req.vendorId;
    //Unauthorized
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //check if vendor is exists
    const existingVendor = await vendorModel.findById(vendorId);

    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    // Find the order by orderId
    const order = await orderModel.findOne({ orderId });
    // If order not found
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Extract user address and cart items from the order
    const { address, cartItems } = order;
    res.status(200).json({
      message: "Successfully fetched address and Cart Items",
      address,
      cartItems,
    });
  } catch (error) {
    next(error);
    console.error("Failed to fetch address and products");
  }
};

export { vendorOrderList, updateOrderStatus, getUserAddressAndItems };
