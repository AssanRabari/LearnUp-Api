import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/errorMiddleware";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notifications.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
require("dotenv").config();

//body parser
app.use(express.json({ limit: "50mb" }));

//cookie parser
app.use(cookieParser());

//cors cross origin resource sharing
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true,
  })
);

//routes

app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`(Route ${req.originalUrl} not found )`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(errorMiddleware);
