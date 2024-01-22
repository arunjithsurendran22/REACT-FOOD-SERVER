import mongoose from "mongoose";

const vendorlogoImageSchema = new mongoose.Schema({
  logoImage: {
    type: String,
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
    required: true,
  },
});

const vendorlogoModel = mongoose.model("vendorLogoImg", vendorlogoImageSchema);

export default vendorlogoModel;
