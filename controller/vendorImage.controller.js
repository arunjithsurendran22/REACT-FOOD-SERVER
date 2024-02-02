import cloudinary from "../cloudinary/cloudinary.js";
import { vendorModel } from "../models/model.js";

//   -------------------------------------------------------------------------------------------------
const addBackgroundImage = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const role = req.role;

    if (role === "vendor" && !vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Invalid file upload" });
    }

    // Check if vendor exists
    let existingVendor = await vendorModel.findById(vendorId);

    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Check if the role is "vendor"
    if (role === "vendor") {
      // Save the new background image directly to the database
      const { secure_url } = await cloudinary.v2.uploader.upload(req.file.path);

      // Check if there is an existing background image for the vendor
      if (existingVendor.backgroundImage) {
        // If an existing image is found, delete it from Cloudinary
        if (existingVendor.backgroundImage.public_id) {
          await cloudinary.v2.uploader.destroy(
            existingVendor.backgroundImage.public_id
          );
        }
        // Update the background image path in the database
        existingVendor.backgroundImage = secure_url;
      } else {
        // If no existing image is found, create a new background image record
        existingVendor.backgroundImage = secure_url;
      }

      await existingVendor.save();

      return res.status(200).json({
        message: "Background image updated successfully",
        backgroundImage: existingVendor.backgroundImage,
      });
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.error("Error adding background image:", error);
    next(error);
    res.status(500).json({ message: "Internal server error" });
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

    // Check if the vendor has a background image
    if (existingVendor.backgroundImage) {
      res.status(200).json({
        message: "Successfully fetched background image",
        backgroundImage: existingVendor.backgroundImage,
      });
    } else {
      res.status(404).json({ message: "Background image not found" });
    }
  } catch (error) {
    next(error);
    console.log(error, "Failed to fetch background image");
    res.status(500).json({ message: "Internal server error" });
  }
};

const addLogoImage = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const role = req.role;

    if (role === "vendor" && !vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Invalid file upload" });
    }

    // Check if vendor exists
    let existingVendor = await vendorModel.findById(vendorId);

    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Check if the role is "vendor"
    if (role === "vendor") {
      // Save the new background image directly to the database
      const { secure_url } = await cloudinary.v2.uploader.upload(req.file.path);

      // Check if there is an existing background image for the vendor
      if (existingVendor.logoImage) {
        // If an existing image is found, delete it from Cloudinary
        if (existingVendor.logoImage.public_id) {
          await cloudinary.v2.uploader.destroy(
            existingVendor.logoImage.public_id
          );
        }
        // Update the background image path in the database
        existingVendor.logoImage = secure_url;
      } else {
        // If no existing image is found, create a new background image record
        existingVendor.logoImage = secure_url;
      }

      await existingVendor.save();

      return res.status(200).json({
        message: "Background image updated successfully",
        backgroundImage: existingVendor.logoImage,
      });
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    next(error);
    console.error(error, "Error for adding logoImage");
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

    // Check if the vendor has a logo image
    if (existingVendor.logoImage) {
      res.status(200).json({
        message: "Successfully fetched logo image",
        logoImage: existingVendor.logoImage,
      });
    } else {
      res.status(404).json({ message: "Logo image not found" });
    }
  } catch (error) {
    next(error);
    console.log(error, "Failed to fetch logo image");
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addBackgroundImage, getBackgroundImage, addLogoImage, getLogoImage };
