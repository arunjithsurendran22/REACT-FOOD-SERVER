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
  // Store profit and loss for each day in a single array
  profitAndLossPerDay: [
    {
      date: {
        type: Date,
      },
      profit: {
        type: Number,
        default: 0,
      },
      loss: {
        type: Number,
        default: 0,
      },
    },
  ],
  vendorBalancesPerDay: [
    {
      vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor", // Reference to the Vendor model
      },
      date: {
        type: Date,
      },
      balance: {
        type: Number,
        default: 0,
      },
    },
  ],
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

const adminModel = mongoose.model("Admin", adminSchema);

export default adminModel;
