import express from "express";
import { createLayout } from "../controllers/layout.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const layoutRouter = express.Router();

layoutRouter.post(
  "/create-layout",
  isAuthenticated,
  authorizeRoles(),
  createLayout
);
export default layoutRouter;
