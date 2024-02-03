import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  image: {
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
  cartItems: [
    {
      couponCode: {
        type: String,
      },
      products: [
        {
          productId: {
            type: String,
          },
          vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "vendor",
          },
          productTitle: {
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
        default: function () {
          return this.cartItems[0].products.reduce(
            (total, product) => total + product.totalPrice,
            0
          );
        },
      },
    },
  ],
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
