import mongoose from "mongoose";

const vendorPincodeSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
  },
});

const vendorAddPincodeModel = mongoose.model(
  "vendorAddPincodes",
  vendorPincodeSchema
);

export default vendorAddPincodeModel;
