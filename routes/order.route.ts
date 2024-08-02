import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";
import { getOrdersAnalytics } from "../controllers/analytics.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrder);

orderRouter.get("/get-orders", isAuthenticated, authorizeRoles(), getAllOrders);

orderRouter.get("/get-orders-analytics", isAuthenticated, authorizeRoles(), getOrdersAnalytics);

export default orderRouter;
