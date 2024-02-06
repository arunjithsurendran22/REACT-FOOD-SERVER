import { userModel, vendorModel } from "../models/model.js";

// GET: user order list
const orderDetails = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Unauthorized
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the user already exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Retrieve the orders array from the user document
    const userOrders = existingUser.orders;

    res
      .status(200)
      .json({ message: "Successfully fetched order details", userOrders });
  } catch (error) {
    next(error);
    console.error("Failed to fetch orders", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//POST :user cance the order status needed to change
const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userOrder = existingUser.orders;

    const orderDetails = userOrder.find((item) => item.orderId === orderId);

    if (!orderDetails) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the status to "Cancelled"
    orderDetails.status = "Cancelled";
    // Save the updated user document
    await existingUser.save();

    res
      .status(200)
      .json({ message: "Order cancelled successfully", orderDetails });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//POST:user product rating
const ratingProduct = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;
    const { rating } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const vendorData = await vendorModel.findById(productId);

    if (!vendorData) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has already rated the product
    const existingRating = vendorData.products[0].ratings.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRating) {
      return res
        .status(400)
        .json({ message: "User has already rated the product" });
    }

    // Add the new rating to the product
    vendorData.products[0].ratings.push({
      userId: userId,
      rating: rating,
    });

    // Calculate the average rating for the product
    const totalRatings = vendorData.products[0].ratings.length;
    const totalRatingSum = vendorData.products[0].ratings.reduce(
      (sum, r) => sum + r.rating,
      0
    );
    const averageRating = totalRatingSum / totalRatings;

    // Update the average rating in the product
    vendorData.products[0].rating = averageRating;

    // Save the changes to the database
    await vendorData.save();

    res
      .status(200)
      .json({ message: "Product rated successfully", averageRating });
  } catch (error) {
    next(error)
    console.error("Failed to rate the product", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { orderDetails, cancelOrder, ratingProduct };
