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
    const { vendorId, productId } = req.params;
    const { rating } = req.body;

    // Basic input validation
    if (!userId || !vendorId || !productId || !rating) {
      return res.status(400).json({ message: "Missing required data" });
    }

    // Check if rating is within valid range
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Fetch user
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch vendor
    const vendorData = await vendorModel.findById(vendorId);
    if (!vendorData) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Find the product being rated
    const product = vendorData.products.find(
      (product) => product._id.toString() === productId
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has already rated the product
    const existingRatingIndex = product.ratings.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRatingIndex !== -1) {
      return res
        .status(400)
        .json({ message: "User has already rated the product" });
    }

    // Add the new rating to the product
    product.ratings.push({
      userId: userId,
      rating: rating,
    });

    // Calculate the average rating for the product
    const totalRatings = product.ratings.length;
    const totalRatingSum = product.ratings.reduce(
      (sum, r) => sum + r.rating,
      0
    );
    const averageRating = totalRatingSum / totalRatings;

    // Update the average rating in the product
    product.rating = averageRating;

    // Save the changes to the database
    await vendorData.save();

    // Return success response
    res
      .status(200)
      .json({ message: "Product rated successfully", averageRating });
  } catch (error) {
    // Handle errors
    next(error);
    console.error("Failed to rate the product", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET: Get user's product rating
const getUserProductRating = async (req, res, next) => {
  try {
    const { vendorId, productId } = req.params;
    const userId = req.userId;

    // Fetch vendor
    const vendorData = await vendorModel.findById(vendorId);
    if (!vendorData) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Find the product in the vendor's products array
    const product = vendorData.products.find(
      (product) => product._id === productId
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the rating given by the user
    const userRating = product.ratings.find(
      (rating) => rating.userId === userId
    );

    // If user hasn't rated the product, return appropriate response
    if (!userRating) {
      return res.status(200).json({
        message: "User hasn't rated this product yet",
        userRating: null,
      });
    }

    // Return the user's rating for the product
    res.status(200).json({
      message: "User's product rating retrieved successfully",
      userRating: userRating.rating,
    });
  } catch (error) {
    // Handle errors
    console.error("Failed to retrieve user's product rating", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export { orderDetails, cancelOrder, ratingProduct, getUserProductRating };
