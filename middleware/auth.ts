require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { redis } from "../utils/redis";
import { IGetUserAuthInfoRequest } from "../@types/custom";

export const isAuthenticated = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
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
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }
    req.user = user as any;
    next();
  }
);

//authorize roles
export const authorizeRoles = (): any => {
  return (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const userRoles = (req as any).user?.role;

    if (!userRoles || !userRoles.includes("admin")) {
      return next(
        new ErrorHandler(
          `Role: ${userRoles} is not allowed to access this resource`,
          403
        )
      );
    }
    return next();
  };
};
