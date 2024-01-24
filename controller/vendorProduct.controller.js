import cloudinary from "../cloudinary/cloudinary.js";
import {
  vendorModel,
  foodCategoryModel,
  productModel,
} from "../models/model.js";

// POST: add food endpoint
const addFoodCategory = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    // Check if the user is authenticated
    const vendorId = req.vendorId;
    const role = req.role;

    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (role === "vendor") {
      const existingVendor = await vendorModel.findById(vendorId);

      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      // Upload image to Cloudinary
      const { secure_url } = await cloudinary.v2.uploader.upload(req.file.path);
      // Create a new food category associated with the vendor
      const newFoodCategory = new foodCategoryModel({
        title,
        description,
        image: secure_url,
        vendorId: vendorId,
      });

      await newFoodCategory.save();

      res.status(201).json({
        message: "Food category added successfully",
        category: newFoodCategory,
      });
    } else {
      return res.status(404).json({ message: "vendor not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in addFoodCategory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET: Get all food categories
const getAllCategories = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const role = req.role;

    if (role === "vendor") {
      const existingVendor = await vendorModel.findById(vendorId);

      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not Found" });
      }
      // Fetch all food categories from the database
      const categories = await foodCategoryModel.find();
      res
        .status(200)
        .json({ message: "Category Successfully fetch", categories });
    } else {
      console.log("vendor not found");
    }
  } catch (error) {
    next(error);
    console.error("Error in getFoodCategories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE: Update a category
const updateFoodCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { title, description } = req.body;
    const vendorId = req.vendorId;
    const role = req.role;
    if (role === "vendor") {
      // Check if the user is authenticated
      if (!vendorId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // Check if the category exists
      const existingCategory = await foodCategoryModel.findOne({
        _id: categoryId,
        vendorId: vendorId,
      });

      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      // Update the category details
      existingCategory.title = title;
      existingCategory.description = description;
      // Check if there is a new image to upload
      if (req.file) {
        // Upload new image to Cloudinary
        const { secure_url } = await cloudinary.v2.uploader.upload(
          req.file.path
        );
        existingCategory.image = secure_url;
      }
      // Save the updated category
      await existingCategory.save();

      res.status(200).json({
        message: "Food category updated successfully",
        category: existingCategory,
      });
    } else {
      return res.status(404).json({ message: "vendor not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in updateFoodCategory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE: Delete a category
const deleteFoodCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const vendorId = req.vendorId;
    const role = req.role;
    // Check if the user is authenticated
    if (role === "vendor") {
      if (!vendorId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // Check if the category exists and belongs to the user
      const existingCategory = await foodCategoryModel.findOneAndDelete({
        _id: categoryId,
        vendorId: vendorId,
      });

      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json({
        message: "Food category deleted successfully",
        category: existingCategory,
      });
    } else {
      return res.status(404).json({ message: "vendor not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in deleteFoodCategory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST: add product item endpoint
const addProductItem = async (req, res, next) => {
  try {
    const { productTitle, description, price, quantity } = req.body;
    const vendorId = req.vendorId;
    const { categoryId } = req.params;

    const role = req.role;
    if (role === "vendor") {
      // Check if the user is authenticated
      if (!vendorId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const existingVendor = await vendorModel.findById(vendorId);
      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      // Check if selected category exists
      const selectedCategory = await foodCategoryModel.findById(categoryId);
      if (!selectedCategory) {
        return res.status(404).json({ message: "Selected category not found" });
      }

      const { title } = selectedCategory;

      const category = title;

      // Upload image to Cloudinary
      const { secure_url } = await cloudinary.v2.uploader.upload(req.file.path);

      // Create a new product item associated with the user, category, and quantity
      const newProductItem = new productModel({
        productTitle,
        description,
        price,
        quantity,
        category,
        image: secure_url,
        categoryId: categoryId,
        vendorId: vendorId,
      });

      await newProductItem.save();

      res.status(201).json({
        message: "Product item added successfully",
        newProductItem: newProductItem,
      });
    } else {
      return res.status(404).json({ message: "Vendor Role mismatch" });
    }
  } catch (error) {
    next(error);
    console.error("Error in addProductItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET: All product items
const getAllProductItems = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const role = req.role;

    //Unauthorized
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //exists vendor
    const existingVendor = await vendorModel.findById(vendorId);
    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (role === "vendor" && vendorId) {
      const productItems = await productModel.find({
        vendorId: vendorId,
      });
      
      res.status(200).json(productItems);
    } else {
      return res.status(404).json({ message: "Vendor Role mismatch" });
    }
  } catch (error) {
    next(error);
    console.error("Error fetching product items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//GET :get specific items for when need to update
const getSpecificProductItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const vendorId = req.vendorId;
    const role = req.role;

    if (role === "vendor") {
      //Unauthorized
      if (!vendorId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      //check if vendor is already exists
      const existingVendor = await vendorModel.findById(vendorId);
      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      //Find the product item
      const specificProduct = await productModel.findOne({
        _id: productId,
        vendorId: vendorId,
      });

      res
        .status(200)
        .json({
          message: "Successfully fetched specific productItem",
          specificProduct,
        });
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    next(error)
    console.error("Failed to fetch specific product item");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE: Product items
const updateProductItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { productTitle, description, price, quantity } = req.body;
    const vendorId = req.vendorId;
    const role = req.role;

    if (role === "vendor") {
      // Check if the user is authenticated
      if (!vendorId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const existingVendor = await vendorModel.findById(vendorId);
      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      // Check if the product item exists and belongs to the user
      const existingProductItem = await productModel.findOne({
        _id: productId,
        vendorId: vendorId,
      });

      if (!existingProductItem) {
        return res.status(404).json({ message: "Product item not found" });
      }

      // Update the product item details
      existingProductItem.productTitle = productTitle;
      existingProductItem.description = description;
      existingProductItem.price = price;
      existingProductItem.quantity = quantity;

      // Check if there is a new image to upload
      if (req.file) {
        // Upload new image to Cloudinary
        const { secure_url } = await cloudinary.v2.uploader.upload(
          req.file.path
        );
        existingProductItem.image = secure_url;
      }

      // Save the updated product item
      await existingProductItem.save();

      res.status(200).json({
        message: "Product item updated successfully",
        productItem: existingProductItem,
      });
    } else {
      return res.status(404).json({ message: "Vendor Role mismatch" });
    }
  } catch (error) {
    next(error);
    console.error("Error in updateProductItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE: Product item
const deleteProductItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const vendorId = req.vendorId;
    const role = req.role;

    if (role === "vendor") {
      // Check if the user is authenticated
      if (!vendorId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const existingVendor = await vendorModel.findById(vendorId);
      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      // Check if the product item exists and belongs to the user
      const existingProductItem = await productModel.findOneAndDelete({
        _id: productId,
        vendorId: vendorId,
      });
      if (!existingProductItem) {
        return res.status(404).json({ message: "Product item not found" });
      }
      res.status(200).json({
        message: "Product item deleted successfully",
        productItem: existingProductItem,
      });
    } else {
      return res.status(404).json({ message: "Vendor Role mismatch" });
    }
  } catch (error) {
    next(error);
    console.error("Error in deleteProductItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getAllCategories,
  addFoodCategory,
  updateFoodCategory,
  deleteFoodCategory,
  getAllProductItems,
  getSpecificProductItem,
  addProductItem,
  updateProductItem,
  deleteProductItem,
};
