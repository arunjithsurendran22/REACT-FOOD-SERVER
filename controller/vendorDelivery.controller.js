import { vendorAddPincodeModel, vendorModel } from "../models/model.js";

//POST: Function to add pincode and delivery fee
const addPincodeDeliveryFee = async (req, res, next) => {
  try {
    // Extract vendorId, role, pincode, and deliveryFee from request
    const { vendorId, role } = req;
    const { pincode, deliveryFee } = req.body;

    // Check if the user is authorized as a vendor
    if (role !== "vendor" || !vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the vendor exists
    const existingVendor = await vendorModel.findById(vendorId);
    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Create a new pincode and delivery fee entry
    const newPincodeDeliveryFee = new vendorAddPincodeModel({
      pincode: pincode,
      deliveryFee: deliveryFee,
    });

    // Save the new pincode and delivery fee entry
    await newPincodeDeliveryFee.save();

    // Respond with success message and the new pincode delivery fee entry
    res.status(200).json({
      message: "Successfully added pincode and delivery fee",
      pincodeDeliveryFee: newPincodeDeliveryFee,
    });
  } catch (error) {
    // Handle errors
    next(error);
    console.error("Failed to add pincode and delivery fee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//GET :get delivery fee and pincode
const getPincodeDeliveryFee = async (req, res, next) => {
  try {
    // Extract vendorId and role from request
    const { vendorId, role } = req;

    // Check authorization
    if (role !== "vendor" || !vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the vendor exists
    const existingVendor = await vendorModel.findById(vendorId);
    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Get all pincode and delivery fee data for the vendor
    const pincodeDeliveryFee = await vendorAddPincodeModel.find({
      vendorId: vendorId,
    });

    // Respond with success message and the pincode delivery fee data
    res.status(200).json({
      message: "Successfully fetched data",
      pincodeDeliveryFee: pincodeDeliveryFee,
    });
  } catch (error) {
    // Handle errors
    next(error);
    console.error("Failed to get pincode and delivery fee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//PUT: Function to edit delivery fee and pincode
const editPincodeDeliveryFee = async (req, res, next) => {
  try {
    // Extract vendorId and role from request
    const { vendorId, role } = req;
    const { pincode, deliveryFee } = req.body;
    const { pincodeId } = req.params;

    // Check authorization
    if (role !== "vendor" || !vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the vendor exists
    const existingVendor = await vendorModel.findById(vendorId);
    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Create or update pincode and delivery fee entry
    const updatedPincodeDeliveryFee =
      await vendorAddPincodeModel.findOneAndUpdate(
        { vendorId: vendorId, _id: pincodeId },
        { deliveryFee: deliveryFee },
        { new: true, upsert: true }
      );

    // Respond with success message and the updated pincode delivery fee data
    res.status(200).json({
      message: "Successfully edited pincode and delivery fee",
      pincodeDeliveryFee: updatedPincodeDeliveryFee,
    });
  } catch (error) {
    // Handle errors
    next(error);
    console.error("Failed to edit pincode and delivery fee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE: Function to delete pincode and delivery fee
const deletePincodeDeliveryFee = async (req, res, next) => {
  try {
    // Extract vendorId and role from request
    const { vendorId, role } = req;
    const { pincodeId } = req.params;

    // Check authorization
    if (role !== "vendor" || !vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the vendor exists
    const existingVendor = await vendorModel.findById(vendorId);
    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Find and delete the pincode and delivery fee entry
    await vendorAddPincodeModel.findByIdAndDelete({
      _id: pincodeId,
      vendorId: vendorId,
    });

    // Respond with success message
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    // Handle errors
    console.error("Failed to delete delivery fee and pincode:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  addPincodeDeliveryFee,
  getPincodeDeliveryFee,
  editPincodeDeliveryFee,
  deletePincodeDeliveryFee,
};
