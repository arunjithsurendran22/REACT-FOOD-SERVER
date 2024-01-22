import cloudinary from "../cloudinary/cloudinary.js";
import { adminModel, foodCategoryModel } from "../models/model.js";

//POST:Add food category endpoint
const addFoodCategory = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    //check if admin is authenticated
    const adminId = req.adminId;
    const role = req.role;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized " });
    }

    if (role === "admin") {
      const existingAdmin = await adminModel.findById(adminId);

      if (!existingAdmin) {
        return res.status(404).json({ message: "admin not found" });
      }

      //upload image to cloudinary
      const { secure_url } = await cloudinary.v2.uploader.upload(req.file.path);

      // Create a new food category associated with the vendor
      const newFoodCategory = new foodCategoryModel({
        title,
        description,
        image: secure_url,
        adminId: adminId,
      });

      await newFoodCategory.save();

      res.status(201).json({
        message: "Food category added successfully",
        category: newFoodCategory,
      });
    } else {
      return res.status(404).json({ message: "admin not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in addFoodCategory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// GET: Get all food categories
const getFoodCategories = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const role = req.role;

    if (role === "admin") {
      const existingAdmin = await adminModel.findById(adminId);

      if (!existingAdmin) {
        return res.status(404).json({ message: "Admin not Found" });
      }
      // Fetch all food categories from the database
      const categories = await foodCategoryModel.find();
      res
        .status(200)
        .json({ message: "Category Successfully fetch", categories });
    } else {
      console.log("Admin not found");
    }
  } catch (error) {
    next(error);
    console.error("Error in getFoodCategories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addFoodCategory ,getFoodCategories };
