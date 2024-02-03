import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
          return this.products.reduce(
            (total, product) => total + product.totalPrice,
            0
          );
        },
      },
    },
  ],
  orders: [
    {
      orderId: {
        type: String,
      },
      paymentId: {
        type: String,
      },
      userId: {
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
      products: [
        {
          productId: {
            type: String,
          },
          vendorId: {
            type: String,
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
      totalAmount: {
        type: Number,
      },
      status: {
        type: String,
        default: "pending",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
