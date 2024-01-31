import mongoose from "mongoose";

const vendorBgImgSchema = new mongoose.Schema({
  image: {
    type: String,
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
  },
});

const vendorBgImgModel = mongoose.model(
  "vendorBackgroundImg",
  vendorBgImgSchema
);

export default vendorBgImgModel;
