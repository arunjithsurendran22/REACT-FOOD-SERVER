import express from "express";
import adminProfileRoute from "./adminProfile.route.js";
import adminProductsRoute from "./adminProduct.route.js";
import adminDashboardRoute from "./adminDashboard.route.js";

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
  {
    path: "/admin/dashboard",
    route: adminDashboardRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
