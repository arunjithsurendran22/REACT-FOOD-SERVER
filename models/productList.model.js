import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  category: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodCategory",
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
    required: true,
  },
});

const productModel = mongoose.model("products", productSchema);

export default productModel;
