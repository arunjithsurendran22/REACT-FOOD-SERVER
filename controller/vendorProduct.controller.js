import cloudinary from "../cloudinary/cloudinary.js";
import { vendorModel, adminModel } from "../models/model.js";

// GET: Get all food categories
const getAllFoodCategories = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const role = req.role;

    if (role === "vendor" && vendorId) {
      // Check if the user is authenticated
      const existingVendor = await vendorModel.findById(vendorId);

      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      const adminDocument = await adminModel.findOne({ role: "admin" });

      if (!adminDocument) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Extract food categories from the admin document
      const foodCategories = adminDocument.foodCategory;

      res.status(200).json({
        message: "Successfully fetched all food categories",
        foodCategories,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Unauthorized or Vendor Role mismatch" });
    }
  } catch (error) {
    next(error);
    console.error("Error in getAllFoodCategories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/// POST: add product item endpoint
const addProductItem = async (req, res, next) => {
  try {
    const { productTitle, description, price, quantity } = req.body;
    const vendorId = req.vendorId;
    const { categoryId } = req.params;
    const role = req.role;

    if (role === "vendor" && vendorId) {
      // Check if the user is authenticated
      const existingVendor = await vendorModel.findById(vendorId);

      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      const adminDocument = await adminModel.findOne();
      
      if (!adminDocument) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const foodCategories = adminDocument.foodCategory;

      const selectedCategory = foodCategories.find(
        (item) => categoryId === item._id.toString()
      );

      if (!selectedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      const categoryTitle = selectedCategory.title;

      // Upload image to Cloudinary
      const { secure_url } = await cloudinary.v2.uploader.upload(req.file.path);

      // Create a new product item
      const newProductItem = {
        productTitle,
        description,
        price,
        quantity,
        category: categoryTitle,
        image: secure_url,
        categoryId: categoryId,
        inStock: true,
      };

      // Add the new product item to the vendor's products array
      existingVendor.products.push(newProductItem);

      // Save the updated vendor document
      await existingVendor.save();

      res.status(201).json({
        message: "Product item added successfully",
        newProductItem: newProductItem,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Unauthorized or Vendor Role mismatch" });
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
    if (role === "vendor" && !vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //exists vendor
    const existingVendor = await vendorModel.findById(vendorId);
    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const productItems = existingVendor.products;
    res
      .status(200)
      .json({ message: "Successfully get products", productItems });
  } catch (error) {
    next(error);
    console.error("Error fetching product items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET: Get specific product item for update
const getSpecificProductItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const vendorId = req.vendorId;

    // Check if the user is authenticated and vendor exists
    const existingVendor = await vendorModel.findById(vendorId);
    if (!existingVendor) {
      return res
        .status(401)
        .json({ message: "Unauthorized or Vendor not found" });
    }

    // Find the product item within the vendor's products array
    const specificProduct = existingVendor.products.find(
      (product) =>
        product._id.toString() === productId &&
        product.vendorId.toString() === vendorId
    );

    if (!specificProduct) {
      return res.status(404).json({ message: "Product item not found" });
    }

    res.status(200).json({
      message: "Successfully fetched specific product item",
      specificProduct,
    });
  } catch (error) {
    next(error);
    console.error("Failed to fetch specific product item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/// UPDATE: Product item
const updateProductItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { productTitle, description, price, quantity } = req.body;
    const vendorId = req.vendorId;

    // Check if the user is authenticated and vendor exists
    const existingVendor = await vendorModel.findById(vendorId);
    if (!existingVendor) {
      return res
        .status(401)
        .json({ message: "Unauthorized or Vendor not found" });
    }

    // Find the product item within the vendor's products array
    const existingProductItem = existingVendor.products.find(
      (product) =>
        product._id.toString() === productId &&
        product.vendorId.toString() === vendorId
    );

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
      const { secure_url } = await cloudinary.v2.uploader.upload(req.file.path);
      existingProductItem.image = secure_url;
    }

    // Save the updated vendor document
    await existingVendor.save();

    res.status(200).json({
      message: "Product item updated successfully",
      productItem: existingProductItem,
    });
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

    // Check if the user is authenticated and vendor exists
    const existingVendor = await vendorModel.findById(vendorId);
    if (!existingVendor) {
      return res
        .status(401)
        .json({ message: "Unauthorized or Vendor not found" });
    }

    // Find the product item within the vendor's products array
    const existingProductItem = existingVendor.products.find(
      (product) => product._id.toString() === productId
    );

    if (!existingProductItem) {
      return res.status(404).json({ message: "Product item not found" });
    }

    // Remove the product item from the products array
    const existingProductItemIndex =
      existingVendor.products.indexOf(existingProductItem);
    existingVendor.products.splice(existingProductItemIndex, 1);

    // Save the updated vendor document
    await existingVendor.save();

    res.status(200).json({
      message: "Product item deleted successfully",
      productItem: existingProductItem,
    });
  } catch (error) {
    next(error);
    console.error("Error in deleteProductItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getAllFoodCategories,
  getAllProductItems,
  getSpecificProductItem,
  addProductItem,
  updateProductItem,
  deleteProductItem,
};
