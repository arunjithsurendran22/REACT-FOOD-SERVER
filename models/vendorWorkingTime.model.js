// models/WorkingTime.js
import mongoose from "mongoose";

const workingTimeSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "",
      null,
    ],
  },
  openingHours: {
    type: String,
  },
  openingState: {
    type: String,
    enum: ["AM", "PM", "", null],
  },
  closingHours: {
    type: String,
  },
  closingState: {
    type: String,
    enum: ["AM", "PM", "", null],
  },
  isClosed: {
    type: Boolean,
    default: false,
    status:String,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
  },
});

const workingTimeModel = mongoose.model("WorkingTime", workingTimeSchema);

export default workingTimeModel;
