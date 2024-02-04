import { adminModel, vendorModel, userModel } from "../models/model.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessTokenAdminSecret = process.env.ADMIN_JWT_SECRET;
const refreshTokenAdminSecret = process.env.ADMIN_REFRESH_TOKEN_SECRET;

//POST:register admin endpoint
const registerAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const role = "admin";

    //validate input fields
    if (!email) {
      return res.json({ message: "email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({
        message: "Password is required and must be 6 characters minimum",
      });
    }
    //check if email already registerd
    const existingEmail = await adminModel.findOne({ email });

    if (existingEmail) {
      return res.json({ message: "Email alredy registerd" });
    }
    //Hash password
    const hashedPassword = await hashPassword(password);

    //create a new admin
    const admin = await adminModel.create({
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({ message: "Registerd Successfully", admin });
  } catch (error) {
    next(error);
    console.log(error, "error for register");
    res.status(500).json({ message: "Internal server error" });
  }
};

//POST :login admin endpoint
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.json({ message: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.json({
        message: "Password is required and minimum 6 charecters needed",
      });
    }

    // Check if the vendor is already registered
    const existingAdmin = await adminModel.findOne({ email });

    if (!existingAdmin) {
      return res.json({ message: "Admin not found" });
    }

    // Check if the password is a match
    const passwordMatch = await comparePassword(
      password,
      existingAdmin.password
    );

    if (!passwordMatch) {
      return res.json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const accessTokenAdmin = jwt.sign(
      {
        id: existingAdmin._id,
        email: existingAdmin.email,
        role: "admin",
      },
      accessTokenAdminSecret,
      { expiresIn: "1d" }
    );
    // generate REFRESH TOKEN
    const refreshTokenAdmin = jwt.sign(
      {
        id: existingAdmin._id,
        email: existingAdmin.email,
        role: "admin",
      },
      refreshTokenAdminSecret,
      { expiresIn: "30d" }
    );

    // Set the token as a cookie in the response
    res.cookie("accessTokenAdmin", accessTokenAdmin, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.cookie("refreshTokenAdmin", refreshTokenAdmin, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    // Set the access token in the response header
    res.setHeader("authorization", `Bearer ${accessTokenAdmin}`);

    return res.status(200).json({
      message: "Login successful",
      _id: existingAdmin._id,
      email: existingAdmin.email,
      accessTokenAdmin: accessTokenAdmin,
      refreshTokenAdmin: refreshTokenAdmin,
    });
  } catch (error) {
    next(error);
    console.log(error, "login failed");
    return res.status(500).json({ message: "Internal server error" });
  }
};

//GET: adminProfile
const getAdminProfile = async (req, res, next) => {
  try {
    const adminId = req.adminId;

    // Retrieve admin profile from the database
    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Exclude sensitive information from the response if needed
    const adminProfile = {
      _id: admin._id,
      email: admin.email,
      role: admin.role,
      // Add other profile information as needed
    };

    return res
      .status(200)
      .json({ message: "Admin profile retrieved successfully", adminProfile });
  } catch (error) {
    next(error);
    console.error("Error in getAdminProfile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//GET:get vendors details
const getAllVendors = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const role = req.role;

    if (role === "admin") {
      //Authorization
      if (!adminId) {
        return res.json({ message: "Unauthorized" });
      }

      const vendorData = await vendorModel.find();

      res
        .status(200)
        .json({ message: "Successfully fetched Vendor Data", vendorData });
    } else {
      console.log("admin not found");
    }
  } catch (error) {
    next(error);
    console.log(error, "failed the user data fetching");
  }
};

// DELETE: delete vendor by ID
const deleteVendor = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const role = req.role;
    const { vendorId } = req.params;

    if (role === "admin") {
      // Authorization
      if (!adminId) {
        return res.json({ message: "Unauthorized" });
      }
      // Find the vendor and delete it
      const deletedVendor = await vendorModel
        .findByIdAndDelete(vendorId)
        .maxTimeMS(30000);

      if (!deletedVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      res.status(200).json({ message: "Vendor deleted successfully" });
    } else {
      console.log("Admin not found");
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(error, "Failed to delete the vendor");
    next(error);
  }
};

//GET :get all customers details
const getAllCustomers = async (req, res, next) => {
  try {
    const adminId = req.adminId;
    const role = req.role;

    if (role === "admin") {
      //unauthorized
      if (!adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      //check if already admin exists
      const existingAdmin = await adminModel.findById(adminId);

      if (!existingAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      //get all customers from userModel
      const customers = await userModel.find();

      res
        .status(200)
        .json({ message: "Successfully fetched userDetails", customers });
    } else {
      console.log("admin not found");
    }
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAllVendors,
  getAllCustomers,
  deleteVendor,
};
