import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getNotifications,
  updateNotificationStatus,
} from "../controllers/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-notifications",
  isAuthenticated,
  authorizeRoles(),
  getNotifications
);

notificationRouter.put(
  "/update-notification/:id",
  isAuthenticated,
  authorizeRoles(),
  updateNotificationStatus
);

export default notificationRouter;
