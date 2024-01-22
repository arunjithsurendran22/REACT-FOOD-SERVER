import express from "express";
import vendorProfileRoute from "./vendorProfile.route.js";
import vendorProductRoute from "./vendorProduct.route.js";
import vendorImageRoute from "./vendorImage.route.js";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/vendor/profile",
    route: vendorProfileRoute,
  },
  {
    path: "/vendor/image-controller",
    route: vendorImageRoute,
  },
  {
    path: "/vendor/products",
    route: vendorProductRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
