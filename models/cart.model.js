import mongoose from "mongoose";

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  couponCode: {
    type: String,
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
      productTitle: {
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
          return this.quantity * this.price;
        },
      },
    },
  ],
  grandTotal: {
    type: Number,
    default: 0,
  },
});

// Update the grandTotal default function to calculate the sum of totalPrice values
cartItemSchema.path("grandTotal").get(function () {
  return this.products.reduce((total, product) => total + product.totalPrice, 0);
});

const cartModel = mongoose.model("CartItem", cartItemSchema);

export default cartModel;
