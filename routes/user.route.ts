import express from "express";
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  updateAccessToken,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
// userRouter.get("/logout", isAuthenticated, authorizeRoles("admin"), logoutUser);
userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.get("/refresh", updateAccessToken);

export default userRouter;
