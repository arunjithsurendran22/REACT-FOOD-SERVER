import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import vendorRoute from "./routes/vendor.route.js";
import userRoute from "./routes/user.routes.js";
import adminRoute from "./routes/admin.route.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.options("*", cors());

// databse connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("database connected.....");
  })
  .catch((error) => {
    console.log(error, "database disconnected.....");
  });

//ROUTING
app.use("/api/v1", vendorRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", adminRoute);
app.use(errorMiddleware);

//Server connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server connected PORT ${PORT}`);
});


