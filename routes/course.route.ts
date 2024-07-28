import express from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  addAnswer,
  addQustion,
  addReview,
  addReviewReply,
  deleteCourse,
  editCourse,
  getAllCourses,
  getAllCoursesAdmin,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";

const courseRouter = express.Router();

courseRouter.post("/create-course", isAuthenticated, authorizeRoles(), uploadCourse);

courseRouter.put("/edit-course/:id", isAuthenticated, authorizeRoles(), editCourse);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

courseRouter.put("/add-question", isAuthenticated, addQustion);

courseRouter.put("/add-answer", isAuthenticated, addAnswer);

courseRouter.put("/add-review/:id", isAuthenticated, addReview);

courseRouter.put("/add-reply", isAuthenticated, authorizeRoles(), addReviewReply);

courseRouter.get("/get-all-courses", isAuthenticated, authorizeRoles(), getAllCoursesAdmin);

courseRouter.delete("/delete-course/:id", isAuthenticated, authorizeRoles(), deleteCourse);

export default courseRouter;
