require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { redis } from "../utils/redis";
export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.accessToken;
    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }
    const decoded = jwt.verify(
      access_token,
      process.env.ACCCESS_TOKEN as string
    ) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }
    const user = await redis.get("userInfo");
    if (!user) {
      return next(new ErrorHandler("user not found", 400));
    }
    req.body = user as any;
    next();
  }
);

//authorize roles
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body?.role || "") {
      return next(
        new ErrorHandler(
          `Role: ${req.body?.role} is not allowed to access this resource`,
          400
        )
      );
    }
    next();
  };
};
