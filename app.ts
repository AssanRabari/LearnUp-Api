import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/errorMiddleware";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notifications.route";
require("dotenv").config();

//body parser
app.use(express.json({ limit: "50mb" }));

//cookie parser
app.use(cookieParser());

//cors cross origin resource sharing
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

//testing
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "testing api",
  });
});

//routes
app.use("/api/v1", userRouter, courseRouter, orderRouter, notificationRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`(Route ${req.originalUrl} not found )`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(errorMiddleware);
