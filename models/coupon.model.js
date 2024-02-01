import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  percentage: {
    type: Number,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  expireDateTime: {
    type: Date,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
});

const couponModel = mongoose.model("Coupon", couponSchema);
export default couponModel;
