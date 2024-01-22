import mongoose from "mongoose";

const vendorAddressSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
});

const vendorAddressModel = mongoose.model("vendorAddress", vendorAddressSchema);
export default vendorAddressModel;
