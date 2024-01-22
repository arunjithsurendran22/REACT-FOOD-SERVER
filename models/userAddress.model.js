import mongoose from "mongoose";

const userAddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
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
});

const userAddressModel = mongoose.model("usersAddress", userAddressSchema);
export default userAddressModel;
