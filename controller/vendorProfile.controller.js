import {
  vendorModel,
  vendorAddressModel,
  orderModel,
  userModel,
} from "../models/model.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessTokenSecretVendor = process.env.VENDOR_JWT_SECRET;
const refreshSecretKeyVendor = process.env.VENDOR_REFRESH_TOKEN_SECRET;

// POST: Register vendor endpoint
const registerVendor = async (req, res, next) => {
  try {
    const { name, mobile, email, password } = req.body;

    const role = "vendor";
    // Validate input fields
    if (!name) {
      return res.json({ message: "Name is required" });
    }
    if (!mobile || mobile.length !== 10) {
      return res.json({
        message: "Mobile is required and must be 10 characters",
      });
    }
    if (!email) {
      return res.json({ message: "Email is required" });
    }
    if (!role) {
      return res.status(404).json({ message: "role is needed" });
    }
    if (!password || password.length < 6) {
      return res.json({
        message: "Password is required and must be 6 characters minimum",
      });
    }

    // Check if email is already registered
    const existingEmail = await vendorModel.findOne({ email });
    if (existingEmail) {
      return res.json({ message: "Email already exists" });
    }

    // Check if mobile is already registered
    const existMobile = await vendorModel.findOne({ mobile });
    if (existMobile) {
      return res.json({ message: "Mobile already registered" });
    }

    if (!existingEmail && !existMobile) {
      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create a new vendor user
      const vendorUser = await vendorModel.create({
        name,
        mobile,
        email,
        password: hashedPassword,
        role,
      });
      return res
        .status(200)
        .json({ message: "Registration Successfully", vendorUser });
    }
  } catch (error) {
    next(error);
    console.log(error, "error for register");
    res.status(500).json({ message: "Internal server error" });
  }
};
// POST: Login vendor endpoint
const loginVendor = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email) {
      return res.json({ message: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({ message: "Password is required" });
    }

    // Check if the vendor is already registered
    const existingVendor = await vendorModel
      .findOne({ email })
      .maxTimeMS(20000);

    if (!existingVendor) {
      return res.json({ message: "User not found" });
    }

    // Check if the password is a match
    const passwordMatch = await comparePassword(
      password,
      existingVendor.password
    );
    if (!passwordMatch) {
      return res.json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const accessTokenVendor = jwt.sign(
      {
        id: existingVendor._id,
        name: existingVendor.name,
        email: existingVendor.email,
        role: "vendor",
      },
      accessTokenSecretVendor,
      { expiresIn: "1d" }
    );
    // generate REFRESH TOKEN
    const refreshTokenVendor = jwt.sign(
      {
        id: existingVendor._id,
        name: existingVendor.name,
        email: existingVendor.email,
        role: "vendor",
      },
      refreshSecretKeyVendor,
      { expiresIn: "30d" }
    );

    // Set the token as a cookie in the response
    res.cookie("accessTokenVendor", accessTokenVendor, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.cookie("refreshTokenVendor", refreshTokenVendor, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.status(200).json({
      message: "Login successful",
      _id: existingVendor._id,
      name: existingVendor.name,
      email: existingVendor.email,
      accessTokenVendor: accessTokenVendor,
      refreshTokenVendor: refreshTokenVendor,
    });
  } catch (error) {
    next(error);
    console.log(error, "login failed");
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST: Refresh vendor token endpoint
const refreshTokenVendor = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshTokenVendor;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, refreshSecretKeyVendor, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Generate a new access token with a short expiration
      const accessTokenVendor = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "vendor",
        },
        accessTokenSecretVendor,
        { expiresIn: "1m" }
      );

      res.json({ accessTokenVendor, message: "Token refreshed!" });
    });
  } catch (error) {
    next(error);
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// POST: Logout vendor endpoint
const logoutVendor = async (req, res, next) => {
  try {
    res.clearCookie("accessTokenVendor");
    res.clearCookie("refreshTokenVendor");

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET: Get vendor profile endpoint
const vendorProfile = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const role = req.role;

    //check if user is authenticated
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the user is a vendor
    if (role === "vendor" && vendorId) {
      const vendor = await vendorModel.findById(vendorId);

      return res.status(200).json(vendor);
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error fetching vendor profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT: Update vendor profile endpoint
const updateVendorProfile = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const role = req.role;
    const {
      newName,
      newMobile,
      newEmail,
      newPassword,
      oldPassword,
      confirmNewPassword,
    } = req.body;

    // Check if the user is authenticated
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the user is a vendor
    if (role === "vendor") {
      // Check if the vendor already exists
      const existingVendorUser = await vendorModel.findById(vendorId);
      if (!existingVendorUser) {
        return res.status(404).json({ message: "User not found" });
      } else {
        // Validate old password
        const isOldPasswordCorrect = await comparePassword(
          oldPassword,
          existingVendorUser.password
        );
        if (!isOldPasswordCorrect) {
          return res.status(401).json({ message: "Invalid Old password" });
        }

        // Validate new password and confirm password match
        if (newPassword !== confirmNewPassword) {
          return res
            .status(400)
            .json({ message: "New password and confirmation do not match" });
        }

        // Hash the new password
        const hashedNewPassword = await hashPassword(newPassword);

        // Update new user details to the database
        existingVendorUser.name = newName || existingVendorUser.name;
        existingVendorUser.mobile = newMobile || existingVendorUser.mobile;
        existingVendorUser.email = newEmail || existingVendorUser.email;
        existingVendorUser.password = hashedNewPassword;

        await existingVendorUser.save();

        return res
          .status(200)
          .json({ message: "User details updated successfully" });
      }
    } else {
      return res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    next(error);
    console.error("Error updating vendor details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//POST:add vendors address end point
const addVendorAddress = async (req, res, next) => {
  try {
    const { street, city, state, landmark, pincode } = req.body;
    const vendorId = req.vendorId;
    //authorization
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingVendor = await vendorModel.findById(vendorId);

    if (!existingVendor) {
      return res.status(404).json({ message: "vendor not found" });
    }

    const vendorAddress = new vendorAddressModel({
      street,
      city,
      state,
      landmark,
      pincode,
      vendorId: vendorId,
    });

    await vendorAddress.save();
  } catch (error) {
    next(error);
    console.log(error, "failed to add vendor address");
  }
};

// POST: get all vendor customers
const vendorCustomers = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;

    // Unauthorized
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if existing vendor
    const existingVendor = await vendorModel.findById(vendorId);

    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Retrieve orders related to the specific vendorId
    const orderDetails = await orderModel.find({ vendorId: vendorId });

    // Destructuring to get userId
    const { userId } = orderDetails[0];

    // Find user details from the userModel
    const userDetails = await userModel.findById(userId);
    
    res.status(200).json({
      message: "UserData fetched successfully",
      userDetails,
    });
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  registerVendor,
  loginVendor,
  vendorProfile,
  updateVendorProfile,
  refreshTokenVendor,
  addVendorAddress,
  logoutVendor,
  vendorCustomers,
};
