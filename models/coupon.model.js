import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
  },
});

const couponModel = mongoose.model("Coupon", couponSchema);
export default couponModel;
