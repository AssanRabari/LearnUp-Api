import express from "express";
import {
  activateUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updateUserAvatar,
  updateUserInfo,
  updateUserPassword,
  updateUserRole,
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

userRouter.post("/social-auth", socialAuth);

userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);

userRouter.put("/update-user-password", isAuthenticated, updateUserPassword);

userRouter.put("/update-user-avatar", isAuthenticated, updateUserAvatar);

userRouter.get("/get-users", isAuthenticated, authorizeRoles(), getAllUsers);

userRouter.put("/update-user-role", isAuthenticated, authorizeRoles(), updateUserRole);

userRouter.delete("/delete-user/:id", isAuthenticated, authorizeRoles(), deleteUser);

export default userRouter;
