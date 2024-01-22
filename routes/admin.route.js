import express from "express";
import adminProfileRoute from "./adminProfile.route.js";
import adminProductsRoute from "./adminProduct.route.js";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/admin/profile",
    route: adminProfileRoute,
  },
  {
    path: "/admin/products",
    route: adminProductsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
