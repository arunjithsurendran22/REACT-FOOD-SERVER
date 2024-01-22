import { userAddressModel, userModel } from "../models/model.js";
import cloudinary from "../cloudinary/cloudinary.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const accessTokenSecretUser = process.env.USER_JWT_SECRET;
const refreshTokenSecretUser = process.env.USER_REFRESH_TOKEN_SECRET;
dotenv.config();

//USER AUTHENTICATION
// ----------------------------------------------------------------------------

//POST: user registration endpoint
const userRegister = async (req, res, next) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name) {
      return res.json({ message: "name is required" });
    }
    if (!mobile || mobile.length !== 10) {
      return res.json({ message: "mobile is required" });
    }
    if (!email) {
      return res.json({ message: "email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({
        message: "password is required and should be at least 6 characters",
      });
    }

    //check if mobile already registered
    const existMobile = await userModel.findOne({ mobile });
    if (existMobile) {
      return res.json({ message: "mobile already exists" });
    }
    //check if email already registered
    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      return res.json({ message: "email already registered" });
    }

    // hash the new password
    const hashedPassword = await hashPassword(password);

    //save to the database
    const user = await userModel.create({
      name,
      mobile,
      email,
      password: hashedPassword,
    });

    return res
      .status(200)
      .json({ user, message: "user registered successfully" });
  } catch (error) {
    next(error);
    console.log(error, "user registration failed");
    return res.status(500).json({ message: "Internal server error" });
  }
};

//POST: user login endpoint
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.json({ message: "email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({
        message: "password is required and should be at least 6 characters",
      });
    }
    //check if email already registered
    const existingUser = await userModel.findOne({ email }).maxTimeMS(20000);

    if (!existingUser) {
      return res.json({ message: "user not found" });
    }
    //check if the password matches
    const passwordMatch = await comparePassword(
      password,
      existingUser.password
    );

    if (!passwordMatch) {
      return res.json({ message: "Invalid password" });
    }

    //generate ACCESS TOKEN
    const accessTokenUser = jwt.sign(
      {
        name: existingUser.name,
        id: existingUser._id,
        email: existingUser.email,
        role: "user",
      },
      accessTokenSecretUser,
      { expiresIn: "1h" }
    );
    // generate REFRESH TOKEN
    const refreshTokenUser = jwt.sign(
      {
        id: existingUser._id,
        role: "user",
      },
      refreshTokenSecretUser,
      { expiresIn: "30d" }
    );

    //set the token as cookies in the response
    res.cookie("accessTokenUser", accessTokenUser, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      path: "/",
    });
    res.cookie("refreshTokenUser", refreshTokenUser, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      path: "/",
    });
    return res.json({
      message: "User Login successful",
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      accessTokenUser: accessTokenUser,
      refreshTokenUser: refreshTokenUser,
    });
  } catch (error) {
    next(error);
    console.log(error, "login failed");
    return res.status(500).json({ message: "Internal server error" });
  }
};

//USER PROFILE MANAGEMENT
// ------------------------------------------------------------------------------

//GET: get user profile endpoint
const userProfile = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //check if user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json(existingUser);
    }
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//PUT: update user profile endpoint
const updateUserProfile = async (req, res, next) => {
  try {
    const {
      newName,
      newMobile,
      newEmail,
      newPassword,
      oldPassword,
      confirmPassword,
    } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //check if user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      //validate old password
      const isPasswordCorrect = await comparePassword(
        oldPassword,
        existingUser.password
      );
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid password" });
      }
    }

    //validate new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "new password and confirm password do not match" });
    }

    //hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    //update the new details in the database
    existingUser.name = newName || existingUser.name;
    existingUser.mobile = newMobile || existingUser.mobile;
    existingUser.email = newEmail || existingUser.email;
    existingUser.password = hashedNewPassword;

    //save the data to the database
    await existingUser.save();

    return res
      .status(200)
      .json({ message: "User profile updated successfully" });
  } catch (error) {
    next(error);
    console.log(error, "error updating user details");
    return res.status(500).json({ message: "Internal server error" });
  }
};

//USER PROFILE PHOTO UPLOAD
// ----------------------------------------------------------------------------

//POST: add user profile photo endpoint
const addUserProfilePhoto = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'Invalid file upload' });
    }
    //check if user exists
    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      //upload image to cloudinary
      const { secure_url } = await cloudinary.v2.uploader.upload(req.file.path);

      existingUser.image = secure_url;

      //save the data to the database
      await existingUser.save();

      res.status(201).json({
        message: "Profile photo uploaded successfully",
        image: req.file.path,
      });
    }
  } catch (error) {
    next(error);
    console.log(error, "error adding profile photo");
    res.status(500).json({ message: "Internal server error" });
  }
};

//USER ADDRESS MANAGEMENT
// ----------------------------------------------------------------------------

//POST: add user address endpoint
const addUserAddress = async (req, res, next) => {
  try {
    const { street, city, state, landmark, pincode } = req.body;
    const userId = req.userId;

    //check if user is authorized
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //check if user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const newUserAddress = new userAddressModel({
      street,
      city,
      state,
      landmark,
      pincode,
      userId: existingUser._id,
    });
    // Save the new user address document
    await newUserAddress.save();
    return res.status(200).json({
      message: "Address added successfully",
      user: newUserAddress,
    });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PUT: update user address endpoint
const updateUserAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { street, city, state, landmark, pincode } = req.body;
    const userId = req.userId;
    //check if user is exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //check if the address is already exists
    const existAddress = await userAddressModel.findById(addressId);
    if (!existAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    //update the address filed
    existAddress.street = street;
    existAddress.city = city;
    existAddress.state = state;
    existAddress.landmark = landmark;
    existAddress.pincode = pincode;

    await existAddress.save();
    return res.status(200).json({
      message: "Address updated successfully",
      user: existAddress,
    });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE: delete user address endpoint
const deleteUserAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // find and remove the address by ID
    const deletedUserAddress = await userAddressModel.findByIdAndDelete(
      addressId
    );

    // check if the address was found and deleted
    if (!deletedUserAddress) {
      return res
        .status(404)
        .json({ message: "Address not found or already deleted" });
    }

    return res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET: get all addresses for a user endpoint
const getUserAddresses = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    //find user address
    const existAddress = await userAddressModel.find();
    return res.status(200).json({
      message: "Addresses retrieved successfully",
      existAddress,
    });
  } catch (error) {
    next(error);
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  userRegister,
  userLogin,
  userProfile,
  updateUserProfile,
  addUserProfilePhoto,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserAddresses,
};
