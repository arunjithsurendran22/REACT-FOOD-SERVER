import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  page: {
    type: String,
    enum: ["home", "menu", "cart"],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
    required: true,
  },
});

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
