import { adminModel, vendorModel } from "../models/model.js";

//GET: get vendor Details for home page card endpoint
const homePageVendorCard = async (req, res, next) => {
  try {
    const vendorData = await vendorModel.find().maxTimeMS(15000);

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
    next(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET: restaurant page
const vendorPage = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const vendorData = await vendorModel
      .findOne({ _id: vendorId })
      .maxTimeMS(15000);

    if (!vendorData) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const formattedData = {
      vendorId: vendorData._id,
      name: vendorData.name,
      backgroundImage: vendorData.backgroundImage,
      logoImage: vendorData.logoImage,
      address: vendorData.address,
      workingHours: vendorData.workingHours,
      products: vendorData.products,
    };

    res
      .status(200)
      .json({ message: "Successfully fetched data", formattedData });
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET: Get categories
const getCategories = async (req, res, next) => {
  try {
    // Fetch categories from the admin model
    const adminData = await adminModel.findOne({}, { foodCategory: 1, _id: 1 });

    if (!adminData) {
      return res.status(404).json({ message: "Categories not found" });
    }

    const categories = adminData.foodCategory;

    res
      .status(200)
      .json({ message: "Categories successfully fetched", categories });
  } catch (error) {
    next(error);
    console.error("Failed to fetch categories", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET: get all products with categories
const getproductByCategory = async (req, res, next) => {
  try {
    const { vendorId, categoryId } = req.params;
    const vendorData = await vendorModel.findById(vendorId);

    const products = vendorData.products.filter(product => product.categoryId.toString() === categoryId);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in getproductByCategory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export { homePageVendorCard, vendorPage, getCategories  ,getproductByCategory};
