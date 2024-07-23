import { NextFunction } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import OrderModel from "../models/order.model";

//create new course order
export const createOder = catchAsyncError(
  async (data: any, next: NextFunction) => {
    const order = await OrderModel.create(data);
    next(order);
  }
);
