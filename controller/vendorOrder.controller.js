import { vendorModel, userModel } from "../models/model.js";

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

    // Find orders by vendorId using aggregation
    const orderList = await userModel.aggregate([
      {
        $unwind: "$orders",
      },
      {
        $unwind: "$orders.products",
      },
      {
        $match: {
          "orders.products.vendorId": vendorId,
        },
      },
    ]);

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

    // Find the order in the orders array and update status
    const user = await userModel.findOne({ "orders.orderId": orderId });

    if (!user) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = user.orders.find((item) => item.orderId === orderId);

    // Update status
    order.status = newStatus;

    // Save the updated user
    await user.save();

    // Update product quantities if order status is "Delivered"
    if (newStatus === "Delivered") {
      for (const item of order.products) {
        // Find the product in the vendor's products array based on productId
        const productToUpdate = existingVendor.products.find((product) =>
          product._id.equals(item.productId)
        );

        if (productToUpdate) {
          productToUpdate.quantity -= item.quantity;

          if (productToUpdate.quantity <= 0) {
            productToUpdate.inStock = false;
          }

          // Save the updated product in the vendor's products array
          await existingVendor.save();
        }
      }
    }

    // Send the updated order in the response
    res.status(200).json(order);
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserAddressAndItems = async (req, res, next) => {
  try {
    const { orderId } = req.params;
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

    // Find the order by orderId
    const order = await userModel.findOne({ "orders.orderId": orderId });

    // If order not found
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Extract user address and cart items from the order
    const { address, products } = order.orders.find(
      (item) => item.orderId === orderId
    );
    res.status(200).json({
      message: "Successfully fetched address and Cart Items",
      address,
      products,
    });
  } catch (error) {
    next(error);
    console.error("Failed to fetch address and products");
  }
};

export { vendorOrderList, updateOrderStatus, getUserAddressAndItems };
