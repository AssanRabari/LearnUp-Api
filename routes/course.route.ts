import express from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  editCourse,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";

const courseRouter = express.Router();
// courseRouter.post("/create-course",isAuthenticated, authorizeRoles("admin"), uploadCourse);

courseRouter.post("/create-course", isAuthenticated, uploadCourse);

courseRouter.put("/edit-course/:id", isAuthenticated, editCourse);

courseRouter.get("/get-course/:id", getSingleCourse);

export default courseRouter;
