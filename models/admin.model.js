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
        ref: "Vendor",
      },
      balancesPerDay: [
        {
          date: {
            type: Date,
          },
          balance: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
  ],
  vendorProfitAndLossPerDay: [
    {
      vendorId:{
        type:String,
      },
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

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
