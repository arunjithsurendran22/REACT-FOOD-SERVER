import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productTitle: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  image: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  category: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodCategory",
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
  },
});

const productModel = mongoose.model("products", productSchema);

export default productModel;
