import { Request } from "express";
import { IUser } from "../models/user.model";

// declare global {
//   namespace Express {
//     export interface Request {
//       user?: any;
//     }
//   }
// }
export interface IGetUserAuthInfoRequest extends Request {
  user: IUser
}