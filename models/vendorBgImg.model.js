import mongoose from "mongoose";

const vendorBgImgSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
    required: true,
  },
});

const vendorBgImgModel = mongoose.model("vendorBackgroundImg",vendorBgImgSchema);

export default vendorBgImgModel;
