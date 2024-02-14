import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  allow: {
    type: String,
    default: "block",
  },
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
  logoImage: {
    type: String,
  },
  backgroundImage: {
    type: String,
  },
  address: {
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
  deliveryArea: [
    {
      pincode: {
        type: Number,
      },
      deliveryFee: {
        type: Number,
      },
    },
  ],
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
      },
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodCategory",
      },
      ratings: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
          rating: {
            type: Number,
          },
        },
      ],
    },
  ],
  workingHours: [
    {
      day: {
        type: String,
        enum: [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "",
          null,
        ],
      },
      openingHours: {
        type: String,
      },
      openingState: {
        type: String,
        enum: ["AM", "PM", "", null],
      },
      closingHours: {
        type: String,
      },
      closingState: {
        type: String,
        enum: ["AM", "PM", "", null],
      },
      isClosed: {
        type: Boolean,
        default: false,
        status: String,
      },
    },
  ],
  balancePerDay: [
    {
      date: Date,
      balance: Number,
    },
  ],
});

const vendorModel = mongoose.model("vendor", vendorSchema);
export default vendorModel;
