import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  foodCategory: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      image: {
        type: String,
      },
    },
  ],
  coupon: [
    {
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
    },
  ],
});

const adminModel = mongoose.model("admin", adminSchema);

export default adminModel;
