import { userModel, vendorModel } from "../models/model.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import { log } from "console";

dotenv.config();

const keyId = process.env.RAZOR_PAY_KEY_ID;
const secretKey = process.env.RAZOR_PAY_SECRET_KEY;
//POST: add to cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, vendorId } = req.params;
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

    // Fetch products from the database vendor model
    const vendorProduct = await vendorModel.findById(vendorId);
    if (!vendorProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get the products array from the vendorProduct
    const productItem = vendorProduct.products;

    // Find the matching product based on productId
    const matchingProduct = productItem.find(
      (item) => item._id.toString() === productId.toString()
    );

    if (!matchingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user already has a cartItem
    let cartItem = existingUser.cartItems[0];

    if (!cartItem) {
      // If the user doesn't have a cartItem, create a new one
      cartItem = {
        couponCode: "",
        products: [],
        grandTotal: 0,
      };

      existingUser.cartItems.push(cartItem);
    }

    // Check if the cart has products
    if (cartItem.products.length > 0) {
      // Check if all products in the cart have the same vendorId
      const isSameVendor = cartItem.products.every(
        (product) => product.vendorId.toString() === vendorId.toString()
      );

      if (!isSameVendor) {
        return res.status(400).json({ message: "Cannot mix products from different vendors" });
      }
    }

    // Find if the product already exists in the cart
    const productIndex = cartItem.products.findIndex(
      (product) =>
        product.productId.toString() === productId.toString() &&
        product.vendorId.toString() === vendorId.toString()
    );

    if (productIndex !== -1) {
      // If the product already exists, increase the quantity
      cartItem.products[productIndex].quantity += 1;
      cartItem.products[productIndex].totalPrice =
        cartItem.products[productIndex].quantity * cartItem.products[productIndex].price;
    } else {
      // If the product doesn't exist, add a new product to the cart
      const newProduct = {
        productId: productId,
        vendorId: vendorId,
        productTitle: matchingProduct.productTitle,
        price: matchingProduct.price,
        image: matchingProduct.image,
        quantity: 1,
        totalPrice: matchingProduct.price, // Initial total price
      };

      cartItem.products.push(newProduct);
    }

    // Update the grandTotal in the cartItem
    cartItem.grandTotal = cartItem.products.reduce(
      (total, product) => total + product.totalPrice,
      0
    );

    // Save the updated user model
    await existingUser.save();

    return res.status(200).json({ message: "Product added to cart successfully", existingUser });
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
    const { Id } = req.params;
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

    // Find the cart item and update the quantity
    const cartItem = existingUser.cartItems.find((item) =>
      item.products.some((product) => product._id.toString() === Id)
    );
    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    // Update the quantity of the product
    const productToUpdate = cartItem.products.find(
      (product) => product._id.toString() === Id
    );
    productToUpdate.quantity = quantity;
    productToUpdate.totalPrice = quantity * productToUpdate.price;

    // Recalculate the total price for each product in the cart
    const total = cartItem.products.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    // Update the grand total in the cart
    cartItem.grandTotal = total;

    // Save the updated user model
    await existingUser.save();

    res
      .status(200)
      .json({ message: "Quantity updated successfully", cartItem, total });
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
    const { Id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItemIndex = existingUser.cartItems.findIndex((item) =>
      item.products.some((product) => product._id.toString() === Id)
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    const removedProduct = existingUser.cartItems[cartItemIndex].products.find(
      (product) => product._id.toString() === Id
    );

    const totalBeforeRemove = existingUser.cartItems[
      cartItemIndex
    ].products.reduce((acc, item) => acc + item.totalPrice, 0);

    existingUser.cartItems[cartItemIndex].products = existingUser.cartItems[
      cartItemIndex
    ].products.filter((product) => product._id.toString() !== Id);

    existingUser.cartItems[cartItemIndex].products.forEach((product) => {
      product.totalPrice = product.price * product.quantity;
    });

    const totalAfterRemove = existingUser.cartItems[
      cartItemIndex
    ].products.reduce((acc, item) => acc + item.totalPrice, 0);

    existingUser.cartItems[cartItemIndex].grandTotal = totalAfterRemove;

    // If cart becomes empty after removing the product, remove applied coupon
    if (existingUser.cartItems[cartItemIndex].products.length === 0) {
      existingUser.cartItems[cartItemIndex].couponCode = "";
      existingUser.cartItems[cartItemIndex].grandTotal = 0;
    }

    await existingUser.save();

    res.status(200).json({
      message: "Product removed from cart successfully",
      removedProduct,
      totalBeforeRemove,
      totalAfterRemove,
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

    // Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has cartItems
    if (!user.cartItems || user.cartItems.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Retrieve the cart details from the user model
    const cartItem = user.cartItems[0];

    res.status(200).json({
      message: "Cart retrieved successfully",
      cart: cartItem,
      grandTotal: cartItem.grandTotal,
    });
  } catch (error) {
    console.error(error);
    next(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//POST:select address from the address model and add to Cart
const selectAddressAddToCart = async (req, res, next) => {
  try {
    //check if user is authenticated
    const userId = req.userId;
    const { addressId } = req.params;
    console.log(addressId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the selected address from the address model
    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "user not found" });
    }

    const userAddress = existingUser.address;

    const existingAddress = userAddress.find(
      (item) => item._id.toString() === addressId.toString()
    );

    console.log(existingAddress);

    return res
      .status(200)
      .json({ message: "Address added to cart successfully", existingAddress });
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

// POST: Save payment details to the database
const order = async (req, res, next) => {
  try {
    const {
      orderId,
      paymentId,
      userId,
      vendorId,
      address,
      cartItems,
      totalToPay,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Step 1: Retrieve User and Address
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Create Order Object
    const orderDetails = {
      vendorId: vendorId,
      orderId: orderId,
      paymentId: paymentId,
      userId: userId,
      address: address,
      products: cartItems.map((item) => ({
        productId: item.productId,
        vendorId: item.vendorId,
        productTitle: item.productTitle,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
      totalAmount: totalToPay,
    };
    // Step 3: Save Order to User
    existingUser.orders.push(orderDetails);

    existingUser.totalAmount = totalToPay;
    // Step 4: Save Changes to Database
    await existingUser.save();
    res
      .status(200)
      .json({ message: "Successfully saved Order Details", orderDetails });
  } catch (error) {
    next(error);
    console.error("Failed to save to the database");
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
