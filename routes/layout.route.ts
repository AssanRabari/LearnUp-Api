import express from "express";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const layoutRouter = express.Router();

layoutRouter.post("/create-layout", isAuthenticated, authorizeRoles(), createLayout);

layoutRouter.put("/edit-layout", isAuthenticated, authorizeRoles(), editLayout);

layoutRouter.get("/get-layout", getLayoutByType);

export default layoutRouter;
