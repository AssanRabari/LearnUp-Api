import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourseService, getAllCoursesService } from "../services/course.service";
import courseModel from "../models/course.model";
import { redis } from "../utils/redis";
import { IGetUserAuthInfoRequest } from "../@types/custom";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notification.model";

//upload course
export const uploadCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourseService(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//update course
export const editCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const courseId = req.params.id;

      const thumbnail = data.thumbnail;

      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const course = await courseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Get single course --without buying
export const getSingleCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = isCacheExist;
        res.status(200).json({ success: true, course });
      } else {
        const course = await courseModel
          .findById(courseId)
          .select(
            "-courseData.videoUrl -courseData.suggestion -courseData.question  -courseData.links"
          );

        await redis.set(courseId, JSON.stringify(course));

        res.status(200).json({ success: true, course });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Get all courses --without buying
export const getAllCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allCourses");

      if (isCacheExist) {
        const course = isCacheExist;
        res.status(200).json({ success: true, course });
      } else {
        const courses = await courseModel
          .find()
          .select(
            "-courseData.videoUrl -courseData.suggestion -courseData.question  -courseData.links"
          );

        await redis.set("allCourses", JSON.stringify(courses));

        res.status(200).json({ success: true, courses });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Get course --for authorized users
export const getCourseByUser = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req?.user?.courses;
      const courseId = req.params.id;

      const courseExists = userCourseList.find(
        (course: any) => course._id.toString() === courseId.toString()
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("Your are not eligible to access this course", 403)
        );
      }

      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const courseData = course?.courseData;

      res.status(200).json({ success: true, courseData });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add questions in course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQustion = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content Id", 400));
      }

      const courseContent = course?.courseData.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content Id", 400));
      }

      //creating new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      //adding question to course
      courseContent.questions.push(newQuestion);

      //creating notification
      await notificationModel.create({
        user: req?.user?._id,
        title: "New Question Recieved",
        message: `You have a new question in ${courseContent?.title}`,
      });

      //save updated course
      await course?.save();

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add answer in question
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;
      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content Id", 400));
      }

      const courseContent = course?.courseData.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content Id", 400));
      }

      const question = courseContent.questions?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Invalid question Id", 400));
      }

      //adding question to course
      const newAnswer: any = { user: req.user, answer };

      //add this answer to question
      question.questionReplies?.push(newAnswer);

      //save updated course
      await course?.save();

      //sending mail notification
      if (req?.user?._id === question.user._id) {
        //creating notification
        await notificationModel.create({
          user: req?.user?._id,
          title: "New Question Reply Recieved",
          message: `You have a new question in ${courseContent?.title}`,
        });
      } else {
        const data = { name: question.user.name, title: courseContent.title };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 400));
        }
      }

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add review in course
interface IAddReviewData {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}

export const addReview = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const { review, rating } = req.body as IAddReviewData;

      const userCourseList = req.user.courses;

      const courseId = req.params.id;

      //check if courseIf exists in userCourseList
      const courseExists = userCourseList.some(
        (course: any) => course._id.toString() === courseId.toString()
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("Your are not eligible to access this course", 403)
        );
      }

      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const reviewData: any = { user: req.user, comment: review, rating };

      course?.reviews?.push(reviewData);

      let avg = 0;

      course?.reviews?.forEach((review: any) => {
        avg += review?.rating;
      });

      if (course) {
        course.ratings = avg / course.reviews.length;
      }

      await course?.save();

      const notification = {
        title: "New Review Recieved",
        message: `${req.user.name} has given review in ${course?.name}`,
      };

      //send notification

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add reply to review (only admin can reply to a review)
interface IAddReviewReplyData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReviewReply = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewReplyData;

      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const review = course?.reviews?.find(
        (review: any) => review._id.toString() === reviewId
      );

      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }

      const replyData: any = { user: req.user, comment };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }
      review.commentReplies.push(replyData);

      await course.save();

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Get all courses --for only admin
export const getAllCoursesAdmin = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
