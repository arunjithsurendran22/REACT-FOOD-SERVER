import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  cartId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  addressId: {
    type: String,
    required: true,
  },
  vendorId: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
