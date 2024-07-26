import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getNotifications } from "../controllers/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-notifications",
  isAuthenticated,
  authorizeRoles(),
  getNotifications
);

export default notificationRouter;
