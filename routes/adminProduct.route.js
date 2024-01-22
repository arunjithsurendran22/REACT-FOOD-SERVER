import express from "express";
import { addFoodCategory , getFoodCategories } from "../controller/controller.js";
import { adminAuthorization } from "../middleware/adminAuthMiddleware.js";
import { uploading } from "../multer/multer.js";

const router = express.Router();

//admin add foodcategories endpoints
router.post("/add-on-category/create",adminAuthorization,uploading, addFoodCategory);
router.get("/food-categories",adminAuthorization,getFoodCategories)

export default router;
