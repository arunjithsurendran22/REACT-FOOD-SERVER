import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  address: [
    {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
    },
  ],
  cartItems:[
    {
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
    }
  ]
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
