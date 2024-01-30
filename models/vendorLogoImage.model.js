import mongoose from "mongoose";

const vendorlogoImageSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
  },
});

const vendorlogoModel = mongoose.model("vendorLogoImg", vendorlogoImageSchema);

export default vendorlogoModel;
