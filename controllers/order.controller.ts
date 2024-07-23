import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import orderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import notificationModel from "../models/notification.model";
import { redis } from "../utils/redis";
import { IGetUserAuthInfoRequest } from "../@types/custom";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import courseModel from "../models/course.model";
import { createOder } from "../services/order.service";

export const createOrder = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      const userId = req?.user?._id;

      const user = await userModel.findById(userId);

      const courseExistsInUser = user?.courses?.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistsInUser) {
        return next(
          new ErrorHandler("You have already purched this course", 400)
        );
      }

      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = { courseId: course._id, userId: user?._id };

      createOder(data, res, next);

      const mailData = {
        order: {
          _id: course?._id?.slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        mailData
      );
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
