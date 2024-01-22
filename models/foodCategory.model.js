import mongoose from "mongoose";

const foodCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admins",
    required: true,
  },
});

const foodCategoryModel = mongoose.model("FoodCategory", foodCategorySchema);

export default foodCategoryModel;
