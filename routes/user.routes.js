import express from "express";
import userProfileRoute from "./userProfile.route.js";
import userProductsRoute from "./user.Product.js";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/user/profile",
    route: userProfileRoute,
  },
  {
    path: "/user/products",
    route: userProductsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
