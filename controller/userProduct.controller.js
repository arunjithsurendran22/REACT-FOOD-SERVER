import { vendorModel } from "../models/model.js";

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
    const vendor = await vendorModel.find();
    // Use populate to get background images for each vendor
    const vendorsWithBackgroundImages = await vendorModel
      .find()
      .populate("image");

    console.log(vendorsWithBackgroundImages);
    console.log(backgroundImage);
    const newArray = vendor.map(({ _id, name }) => ({ _id, name }));

    console.log(newArray);

    res.status(200).json({ message: "Succesfully", vendor });
  } catch (error) {
    next(error);
    console.log(error, "failed to get restaurant ");
  }
};


//GET: get vendor Details for home page card endpoint
const homePageVendorCard = async (req, res, next) => {
  try {
    const vendorData = await vendorModel.find();

    const formattedData = vendorData.map((item) => ({
      vendorId: item._id,
      name: item.name,
      backgroundImage: item.backgroundImage,
      logoImage: item.logoImage,
      address: item.address,
      workingHours: item.workingHours,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    next(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  userGetAllCategories,
  userGetAllProductItems,
  userGetAllRestaurant,
  homePageVendorCard,
};
