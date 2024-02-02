import { vendorModel } from "../models/model.js";

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

    // Unauthorized
    if (role === "vendor" && !vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if vendor exists
    const existingVendor = await vendorModel.findById(vendorId);

    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Find existing working time for the vendor and day
    const existingWorkingHours = existingVendor.workingHours.find(
      (workingTime) => workingTime.day === day
    );

    if (existingWorkingHours) {
      // If existing working time found, update the values
      existingWorkingHours.set({
        day,
        openingHours: isClosed ? "" : openingHours,
        openingState: isClosed ? "" : openingState,
        closingHours: isClosed ? "" : closingHours,
        closingState: isClosed ? "" : closingState,
        isClosed,
      });

      await existingVendor.save();
      res.status(200).json({
        message: "Working time updated successfully",
        workingHours: existingVendor.workingHours,
      });
    } else {
      // If no existing working time found, create a new one
      const newWorkingTime = {
        day,
        openingHours: isClosed ? "" : openingHours,
        openingState: isClosed ? "" : openingState,
        closingHours: isClosed ? "" : closingHours,
        closingState: isClosed ? "" : closingState,
        isClosed,
      };

      existingVendor.workingHours.push(newWorkingTime);
      await existingVendor.save();

      res.status(201).json({
        message: "Working time added successfully",
        workingHours: existingVendor.workingHours,
      });
    }
  } catch (error) {
    next(error);
    console.log("Failed to add working hours");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createWorkingHours };
