import { Response } from "express";
import courseModel from "../models/course.model";
import { catchAsyncError } from "../middleware/catchAsyncError";

//create course
export const createCourseService = catchAsyncError(
  async (data: any, res: Response) => {
    const course = await courseModel.create(data);
    res.status(201).json({ success: true, course });
  }
);

//Get all courses
export const getAllCoursesService = async (res: Response) => {
  const courses = await courseModel.find().sort({ createdAt: -1 });

  res.status(201).json({ success: true, courses });
};
