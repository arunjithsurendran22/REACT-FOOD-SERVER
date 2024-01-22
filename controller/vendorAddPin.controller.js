import { vendorAddPincodeModel } from "../models/model.js";

//POST :vendor add pincode for delievery area and fee for delivery
const addPincodeAndDeliveryFee = async (req, res, next) => {
  try {
    const { pincode, deliveryFee } = req.body;
    const vendorId = req.vendorId;
    const role = req.role;

    // Check if vendor is authenticated
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === "vendor") {
      // Check if pincode already exists
      const existingPincode = await vendorAddPincodeModel.findOne({
        pincode: pincode,
      });

      if (existingPincode) {
        return res.status(400).json({ message: "Pincode already exists" });
      }

      // Create and save new entry
      const pincodeAndDelivery = new vendorAddPincodeModel({
        pincode: pincode,
        deliveryFee: deliveryFee,
      });

      await pincodeAndDelivery.save();

      return res
        .status(200)
        .json({ message: "Pincode and delivery fee added successfully" });
    } else {
      return res.status(404).json({ message: "Not a vendor" });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//PUT:update delivery fee
const updateDeliveryFee = async (req, res, next) => {
  try {
    const { deliveryFee } = req.body;
    const { pincodeId } = req.params;
    const vendorId = req.vendorId;
    const role = req.role;

    // Check if vendor is authenticated
    if (!vendorId || role !== "vendor") {
      return res.status(401).json({ message: "Unauthorized or not a vendor" });
    }

    // Update delivery fee
    const updatedPincode = await vendorAddPincodeModel.findByIdAndUpdate(
      pincodeId,
      { deliveryFee: deliveryFee },
      { new: true }
    );

    if (updatedPincode) {
      return res
        .status(200)
        .json({
          message: "Successfully updated delivery fee",
        });
    } else {
      return res.status(404).json({ message: "Pincode not found" });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//GET :get all picode and delivery fee
const getAllPincode = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const role = req.role;

    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role === "vendor") {
      const allPincode = await vendorAddPincodeModel.find();
      res
        .status(200)
        .json({ message: "successfully get all pincode", allPincode });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addPincodeAndDeliveryFee, updateDeliveryFee, getAllPincode };
