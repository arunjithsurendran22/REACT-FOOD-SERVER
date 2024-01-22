import cloudinary from "../cloudinary/cloudinary.js";
import {
  Banner,
  vendorModel,
  vendorlogoModel,
  vendorBgImgModel,
} from "../models/model.js";

//POST :Add banner endpoint
const addBanner = async (req, res, next) => {
  try {
    const { page, title, description } = req.body;
    const vendorId = req.vendorId;
    const role = req.role;
    //check if user is authenticated
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (role === "vendor") {
      //check if user is already exist
      const existingVendor = await vendorModel.findById(vendorId);

      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      } else {
        //upload banner to cloudinary
        const { secure_url } = await cloudinary.v2.uploader.upload(
          req.file.path
        );
        //create new banner
        const newBanner = new Banner({
          page,
          title,
          description,
          image: secure_url,
          vendorId: vendorId,
        });
        await newBanner.save();
        res
          .status(201)
          .json({ message: "Banner added successfully", banner: newBanner });
      }
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in addBanner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//PUT :Update the banner endpoint
const updateBanner = async (req, res, next) => {
  try {
    const { page, title, description } = req.body;
    const { bannerId } = req.params;
    const vendorId = req.vendorId;
    const role = req.role;
    //check if the user is authenticated
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (role === "vendor") {
      //check if user is already exist
      const existingVendor = await vendorModel.findById(vendorId);
      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      } else {
        //check if the banner already exist
        const existingBanner = await Banner.findById(bannerId);
        if (!existingBanner || existingBanner.vendor.toString() !== vendorId) {
          return res.status(403).json({
            message: "You are not the owner of this banner",
          });
        } else {
          existingBanner.page = page;
          existingBanner.title = title;
          existingBanner.description = description;
          await existingBanner.save();
          res.status(200).json({
            message: "Banner updated successfully",
            banner: existingBanner,
          });
        }
      }
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in updateBanner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//DLETE:delete the banner endpoint
const deleteBanner = async (req, res, next) => {
  try {
    const { bannerId } = req.params;
    const vendorId = req.vendorId;
    const role = req.role;
    //check if the user id authenticated
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (role === "vendor") {
      //check if the user is already exist
      const existingVendor = await vendorModel.findById(vendorId);
      if (!existingVendor) {
        return res.status(403).json({ message: "Vendor not found" });
      } else {
        // check ownership and delete banner
        const existingBanner = await Banner.findById(bannerId);
        if (!existingBanner || existingBanner.vendor.toString() !== vendorId) {
          return res
            .status(403)
            .json({ message: "You are not the owner of this banner" });
        } else {
          await existingBanner.remove();
        }
      }
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in deleteBanner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//GET :Get all banner end point
const getAllBanners = async (req, res, next) => {
  try {
    const role = req.role;
    if (role === "vendor") {
      //fetch all banners
      const banners = await Banner.find({ vendorId: req.vendorId });
      res.status(200).json({ banners });
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error in getAllBanners:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// -------------------------------------------------------------------------------------------------

//   -------------------------------------------------------------------------------------------------

// POST: background image upload endpoint
const addBackgroundImage = async (req, res, next) => {
  try {
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

      // Check if there is an existing background image for the vendor
      let existingBackgroundImage = await vendorBgImgModel.findOne({
        vendorId: vendorId,
      });

      if (existingBackgroundImage) {
        // If an existing image is found, update the URL
        const { secure_url } = await cloudinary.v2.uploader.upload(
          req.file.path
        );

        existingBackgroundImage.backgroundImage = secure_url;
        await existingBackgroundImage.save();

        return res.status(200).json({
          message: "Background image updated successfully",
          backgroundImage: existingBackgroundImage,
        });
      } else {
        // If no existing image is found, create a new background image record
        const { secure_url } = await cloudinary.v2.uploader.upload(
          req.file.path
        );

        const newBackgroundImage = new vendorModel({
          backgroundImage: secure_url,
          vendorId: vendorId,
        });

        await newBackgroundImage.save();

        return res.status(201).json({
          message: "Background image uploaded successfully",
          backgroundImage: newBackgroundImage,
        });
      }
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    next(error);
    console.error(error, "Error for adding/updating background image");
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET: Get background image endpoint
const getBackgroundImage = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;

    // Unauthorized
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingVendor = await vendorModel.findById(vendorId);

    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const backgroundImage = await vendorBgImgModel.findOne({ vendorId });
    res.status(200).json({
      message: "Successfully fetched background image",
      backgroundImage,
    });
  } catch (error) {
    next(error);
    console.log(error, "Failed to fetch background image");
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE: Delete background image for a vendor
const deleteBackgroundImage = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const role = req.role;

    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === "vendor") {
      const existingVendor = await vendorModel.findById(vendorId);

      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      } else {
        // Check if a background image already exists
        const existingBackgroundImage = await vendorBgImgModel.findOne({
          vendorId,
        });

        if (!existingBackgroundImage) {
          return res
            .status(404)
            .json({ message: "Background image not found" });
        }

        // Delete the background image
        await existingBackgroundImage.remove();

        res.status(200).json({
          message: "Background image deleted successfully",
          backgroundImage: existingBackgroundImage,
        });
      }
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    next(error);
    console.log(error, "Error deleting backgroundImage");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST: add logo image endpoint
const addLogoImage = async (req, res, next) => {
  try {
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

      // Check if there is an existing logo image for the vendor
      let existingLogoImage = await vendorlogoModel.findOne({
        vendorId: vendorId,
      });

      if (existingLogoImage) {
        // If an existing image is found, update the URL
        const { secure_url } = await cloudinary.v2.uploader.upload(
          req.file.path
        );

        existingLogoImage.logoImage = secure_url;
        await existingLogoImage.save();

        return res.status(200).json({
          message: "Logo image updated successfully",
          logoImage: existingLogoImage,
        });
      } else {
        // If no existing image is found, create a new logo image record
        const { secure_url } = await cloudinary.v2.uploader.upload(
          req.file.path
        );

        const newLogoImage = new vendorlogoModel({
          logoImage: secure_url,
          vendorId: vendorId,
        });

        await newLogoImage.save();

        return res.status(201).json({
          message: "Logo image uploaded successfully",
          logoImage: newLogoImage,
        });
      }
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    next(error);
    console.error(error, "Error for adding/updating logoImage");
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET: Fetch logo image
const getLogoImage = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;

    // Unauthorized
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingVendor = await vendorModel.findById(vendorId);
    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Fetch the logo image for the specific vendor
    const logoImage = await vendorlogoModel.findOne({ vendorId });
    res
      .status(200)
      .json({ message: "Successfully fetched logo image", logoImage });
  } catch (error) {
    next(error);
    console.log(error, "Failed to fetch logo image");
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE: Delete logo image for a vendor
const deleteLogoImage = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const role = req.role;

    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === "vendor") {
      const existingVendor = await vendorModel.findById(vendorId);

      if (!existingVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      } else {
        // Check if a logo image already exists
        const existingLogoImage = await vendorlogoModel.findOne({ vendorId });

        if (!existingLogoImage) {
          return res.status(404).json({ message: "Logo image not found" });
        }

        // Delete the logo image
        await existingLogoImage.remove();

        res.status(200).json({
          message: "Logo image deleted successfully",
          logoImage: existingLogoImage,
        });
      }
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    next(error);
    console.log(error, "Error deleting logoImage");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  addBanner,
  updateBanner,
  deleteBanner,
  getAllBanners,
  addBackgroundImage,
  getBackgroundImage,
  deleteBackgroundImage,
  addLogoImage,
  getLogoImage,
  deleteLogoImage,
};
