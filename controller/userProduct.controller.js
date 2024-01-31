import {
  foodCategoryModel,
  productModel,
  vendorBgImgModel,
} from "../models/model.js";


//GET:controller for get all vendors food categories
const userGetAllCategories = async (req, res, next) => {
  try {
    //fetch all category items
    const categories = await foodCategoryModel.find();
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
    console.log(error, "error for fetching category");
    return res.status(500).json({ message: "Internal server error" });
  }
};

//GET :controller for get all products items
const userGetAllProductItems = async (req, res, next) => {
  try {
    //fecth all product items
    const productItem = await productModel.find();

    return res.status(200).json(productItem);
  } catch (error) {
    next(error);
    console.log(error, "error for fetching product items");
    return res.status(500).json({ message: "Internal server error" });
  }
};

//GET:get all popular restaurant endpoint
const userGetAllRestaurant = async (req, res, next) => {
  try {
    const restaurants = await vendorBgImgModel.find()
    res.status(200).json({ message: "Successfully fetched data", restaurants });
  } catch (error) {
    next(error);
    console.log(error, "failed to get restaurant ");
  }
};

export { userGetAllCategories, userGetAllProductItems, userGetAllRestaurant };
