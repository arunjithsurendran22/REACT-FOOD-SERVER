import mongoose from "mongoose";

const vendorNewSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  mobile: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  address: [
    {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      landmark: {
        type: String,
      },
      pincode: {
        type: Number,
      },
    },
  ],
  backgroundImage: {
    type: String,
  },
  logoImage: {
    type: String,
  },
  products: [
    {
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
    },
  ],
});
