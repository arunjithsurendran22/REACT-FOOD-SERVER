import mongoose from "mongoose";

const favoritesModelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodCategory",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const favoritesModel = mongoose.model("favorites", favoritesModelSchema);

export default favoritesModel;
