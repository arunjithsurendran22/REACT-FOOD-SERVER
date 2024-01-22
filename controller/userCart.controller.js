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

    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has an existing cart item
    let cartItem = await cartModel.findOne({ userId });

    if (!cartItem) {
      // If the user doesn't have a cart item, create a new one
      cartItem = new cartModel({
        userId: userId,
        products: [],
      });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cartItem.products.findIndex(
      (product) => String(product.productId) === productId
    );

    if (existingProductIndex !== -1) {
      // If the product already exists, update the quantity and total price
      cartItem.products[existingProductIndex].quantity += 1;
      cartItem.products[existingProductIndex].totalPrice =
        cartItem.products[existingProductIndex].price *
        cartItem.products[existingProductIndex].quantity;
    } else {
      // If the product doesn't exist, add it to the cart
      const product = await productModel.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      cartItem.products.push({
        productId: product._id,
        vendorId: product.vendorId,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
        totalPrice: product.price,
      });
    }

    // Save the cart item to the database
    await cartItem.save();

    // Calculate the total price of all products in the cart
    const total = cartItem.products.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    return res
      .status(200)
      .json({ message: "Product added to cart successfully", total });
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

    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the user
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the product from the cart
    const cartItem = await cartModel.findOneAndUpdate(
      { userId, "products.productId": productId },
      { $pull: { products: { productId: productId } } },
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

    res
      .status(200)
      .json({ message: "Product removed from cart successfully", total });
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
