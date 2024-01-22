import mongoose from "mongoose";

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendor",
      },
      title: {
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
        default: 1,
      },
      totalPrice: {
        type: Number,
        default: function () {
          return this.price * this.quantity;
        },
      },
    },
  ],
});

const cartModel = mongoose.model("CartItem", cartItemSchema);

export default cartModel;
