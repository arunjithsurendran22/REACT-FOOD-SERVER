import { workingTimeModel, vendorModel } from "../models/model.js";

//POST :set vendor working time

const createWorkingHours = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const role = req.role;
    const {
      day,
      openingHours,
      openingState,
      closingHours,
      closingState,
      isClosed,
    } = req.body;

    //unauthorized
    if (role === "vendor" && !vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //check if vendor is already exists
    const existingVendor = await vendorModel.findById(vendorId);

    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    // Find existing working time for the vendor and day
    const existingWorkingHours = await workingTimeModel.findOne({
      vendorId: vendorId,
    });

    if (existingWorkingHours) {
      //If existing working time found, update the values
      existingWorkingHours.set({
        day,
        openingHours: isClosed ? "" : openingHours,
        openingState: isClosed ? "" : openingState,
        closingHours: isClosed ? "" : closingHours,
        closingState: isClosed ? "" : closingState,
        isClosed,
      });

      await existingWorkingHours.save();
      res.status(200).json({
        message: "Working time updated successfully",
        workingHours: existingWorkingHours,
      });
    } else {
      // If no existing working time found, create a new one
      const newWorkingTime = new workingTimeModel({
        day,
        openingHours: isClosed ? "" : openingHours,
        openingState: isClosed ? "" : openingState,
        closingHours: isClosed ? "" : closingHours,
        closingState: isClosed ? "" : closingState,
        vendorId,
        isClosed,
      });

      await newWorkingTime.save();

      res.status(201).json({
        message: "Working time added successfully",
        workingHours: newWorkingTime,
      });
    }
  } catch (error) {
    next(error);
    console.log("failed to add working hours");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createWorkingHours };
