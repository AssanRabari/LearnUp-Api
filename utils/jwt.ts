require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?:boolean
}
// const const sendToken =(user:IUser,statusCode:number)
