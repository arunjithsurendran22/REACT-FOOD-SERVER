import {
  userModel,
  productModel,
  cartModel,
  userAddressModel,
  orderModel,
} from "../models/model.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

const keyId = process.env.RAZOR_PAY_KEY_ID;
const secretKey = process.env.RAZOR_PAY_SECRET_KEY;

// POST: Add product to cart
const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    console.log("params", productId);
    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    // Check if the product is already in the user's cart
    const existingCartItem = await cartModel.findOne({
      userId,
      "products.productId": productId,
    });

    // Check if the product has the same vendorId as the existing items in the cart
    if (existingCartItem) {
      const isSameVendor = existingCartItem.products.every(
        (cartProduct) =>
          cartProduct.vendorId.toString() === product.vendorId.toString()
      );
      if (!isSameVendor) {
        return res.status(400).json({
          message:
            "Cannot add products from different vendors to the same cart",
        });
      }
    }
    if (existingCartItem) {
      // If the product already exists in the cart, increase quantity and update total price
      await cartModel.findOneAndUpdate(
        {
          userId,
          "products.productId": product._id,
        },
        {
          $inc: { "products.$.quantity": 1 },
          $set: {
            "products.$.totalPrice":
              product.price * (existingCartItem.products[0].quantity + 1),
          },
        }
      );
    } else {
      // If the product is not in the cart, add it
      await cartModel.findOneAndUpdate(
        { userId },
        {
          $push: {
            products: {
              productId: product._id,
              vendorId: product.vendorId,
              productTitle: product.productTitle,
              price: product.price,
              image: product.image,
              quantity: 1,
              totalPrice: product.price,
            },
          },
        },
        { upsert: true }
      );
    }
    return res
      .status(200)
      .json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error(error);
    next(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PUT: Edit quantity of product item endpoint
const updateQuantity = async (req, res, next) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;
    const { quantity } = req.body;

    // If the user is not authenticated
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the user
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the cart item
    const cartItem = await cartModel.findOneAndUpdate(
      { userId, "products.productId": productId },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    // Calculate the total price
    const total = cartItem.products.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    res.status(200).json({ message: "Quantity updated successfully", total });
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE: Cart item remove
const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;
    console.log(userId);

    //check if user is Authenticated
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //find user
    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find the cart item
    const cartItem = await cartModel.findOne({ userId });
    console.log(cartItem);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }
    // Find the product in the cart
    const productIndex = cartItem.products.findIndex(
      (product) => String(product.productId) === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Cart empty" });
    }
    // Remove the product from the cart
    const removedProduct = cartItem.products.splice(productIndex, 1);

    // Save the updated cartItem
    await cartItem.save();

    // Calculate the total price
    const total = cartItem.products.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    res.status(200).json({
      message: "Product removed from cart successfully",
      removedProduct,
      total,
    });
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// View Cart
const viewCart = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the user and their cart
    const user = await userModel.findById(userId);
    const cartItem = await cartModel.findOne({ userId });

    if (!user || !cartItem) {
      return res.status(404).json({ message: "User or cart not found" });
    }

    // Calculate total price
    const total = cartItem.products.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    res.status(200).json({
      message: "Cart retrieved successfully",
      cart: cartItem,
      total,
    });
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//POST:select address from the address model and add to Cart
const selectAddressAddToCart = async (req, res, next) => {
  try {
    //check if user is authenticated
    const userId = req.userId;
    const { addressId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the selected address from the address model
    const selectedAddress = await userAddressModel.findById(addressId);

    if (!selectedAddress) {
      return res
        .status(404)
        .json({ message: "Address not found for the user" });
    }

    // Create a cart item with the selected address
    const cartItem = new cartModel({
      street: selectedAddress.street,
      city: selectedAddress.city,
      state: selectedAddress.state,
      landmark: selectedAddress.landmark,
      pincode: selectedAddress.pincode,
    });

    // Save the cart item to the database
    await cartItem.save();

    return res
      .status(200)
      .json({ message: "Address added to cart successfully", cartItem });
  } catch (error) {
    next(error);
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//POST:Razorpay payment method endpoint
const orderPayment = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: secretKey });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      throw new Error("Failed to create order");
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error during payment:", error);
    next(error);
  }
};

//POST:Razorpay payment verify method endpoint
const validatePayment = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const sha = crypto.createHmac("sha256", secretKey);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: "Transation is not Success" });
    }

    res.status(200).json({
      message: "Transation Successfull",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Error during verification", error);
    next(error);
  }
};

//POST:payment details will save to database
const order = async (req, res, next) => {
  try {
    const { orderId, paymentId, cartId, userId, addressId, vendorId, total } =
      req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderDetails = new orderModel({
      orderId,
      paymentId,
      cartId,
      userId,
      addressId,
      vendorId,
      total,
    });
    await orderDetails.save();
    res
      .status(200)
      .json({ message: "Successfully saved Order Details", orderDetails });
  } catch (error) {
    next(error);
    console.error("failed to save database");
  }
};
export {
  addToCart,
  viewCart,
  updateQuantity,
  removeCartItem,
  selectAddressAddToCart,
  orderPayment,
  validatePayment,
  order,
};
