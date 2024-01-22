import { favoritesModel, productModel, userModel } from "../models/model.js";

// POST: Add product to favorites endpoint
const addToFavorites = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product already exists in favorites
    const existingFavoriteItem = await favoritesModel.findOne({
      userId: existingUser._id,
      productId: product._id,
    });

    if (existingFavoriteItem) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    // Add to favorites
    const favoritesItem = new favoritesModel({
      userId: existingUser._id,
      productId: product._id,
      vendorId: product.vendorId,
      categoryId: product.categoryId,
      title: product.title,
      price: product.price,
      image: product.image,
    });

    await favoritesItem.save();

    res
      .status(200)
      .json({ message: "Product added to favorites successfully" });
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE:items will remove from favorites
const removefromFavorites = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    //check if user is authenticated
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    //check if products exists from favorites
    const existingFavoriteItem = await favoritesModel.findOneAndDelete({
      userId: existingUser._id,
      productId: productId,
    });
    if (!existingFavoriteItem) {
      return res
        .status(404)
        .json({ message: "Product not found in favorites" });
    }

    res
      .status(200)
      .json({ message: "Product removed from favorites successfully" });
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//GET :get all favorites endpoint
const getAllFavorites = async (req, res, next) => {
  try {
    const userId = req.userId;
    //check if user is authenticated
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //check if user is already exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const favoritesItems =await favoritesModel.find()
    res.status(200).json({message:"successfully get all favorites",favoritesItems})
  } catch (error) {
    next(error);
  }
};

export { addToFavorites, removefromFavorites ,getAllFavorites };
