import { vendorModel } from "../models/model.js";

// POST: Function to add pincode and delivery fee
const addPincodeDeliveryFee = async (req, res, next) => {
  try {
    // Extract vendorId, role, pincode, and deliveryFee from request
    const vendorId = req.vendorId;
    const role = req.role;
    const { pincode, deliveryFee } = req.body;

    // Check if the user is authorized as a vendor
    if (role !== "vendor" || !vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the vendor exists
    const existingVendor = await vendorModel
      .findById(vendorId)
      .maxTimeMS(30000);
    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Create a new pincode and delivery fee entry
    const newPincodeDeliveryFee = {
      pincode: pincode,
      deliveryFee: deliveryFee,
    };

    // Add the new pincode and delivery fee entry to the deliveryArea array
    existingVendor.deliveryArea.push(newPincodeDeliveryFee);

    // Save the updated vendor document
    await existingVendor.save();

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

// GET: Get delivery fee and pincode
const getPincodeDeliveryFee = async (req, res, next) => {
  try {
    // Extract vendorId and role from request
    const { vendorId, role } = req;

    // Check authorization
    if (role !== "vendor" || !vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the vendor exists
    const existingVendor = await vendorModel
      .findById(vendorId)
      .maxTimeMS(30000);
    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Get all pincode and delivery fee data for the vendor from the deliveryArea array
    const pincodeDeliveryFee = existingVendor.deliveryArea;

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

// PUT: Function to edit delivery fee and pincode
const editPincodeDeliveryFee = async (req, res, next) => {
  try {
    const { vendorId, role } = req;
    const { pincodeId } = req.params;
    const { deliveryFee } = req.body;

    // Check authorization
    if (role !== "vendor" || !vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the vendor and update delivery fee for the specific pincode entry
    const updatedVendor = await vendorModel.findOneAndUpdate(
      { _id: vendorId, "deliveryArea._id": pincodeId },
      { $set: { "deliveryArea.$.deliveryFee": deliveryFee } },
      { new: true }
    );

    if (!updatedVendor) {
      return res
        .status(404)
        .json({ message: "Vendor or pincode entry not found" });
    }

    const updatedEntry = updatedVendor.deliveryArea.find(
      (entry) => entry._id == pincodeId
    );

    // Respond with success message and the updated pincode delivery fee data
    res.status(200).json({
      message: "Successfully edited pincode and delivery fee",
      pincodeDeliveryFee: updatedEntry,
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
    const { vendorId, role } = req;
    const { pincodeId } = req.params;

    // Check authorization
    if (role !== "vendor" || !vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the vendor exists
    const existingVendor = await vendorModel
      .findById(vendorId)
      .maxTimeMS(30000);
    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Find the index of the delivery area entry to be deleted
    const deliveryAreaIndex = existingVendor.deliveryArea.findIndex(
      (entry) => entry._id == pincodeId
    );

    if (deliveryAreaIndex === -1) {
      return res
        .status(404)
        .json({ message: "Pincode and delivery fee entry not found" });
    }

    // Remove the specific entry from the deliveryArea array
    existingVendor.deliveryArea.splice(deliveryAreaIndex, 1);

    // Save the updated vendor document
    await existingVendor.save();

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
