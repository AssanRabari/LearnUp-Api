import { Response } from "express";
import userModel from "../models/user.model";
import { redis } from "../utils/redis";

//get user by Id
export const getUserById = async (id: string, res: Response) => {
  // const user = await userModel.findById(id);
  const userInfo = await redis.get("userInfo");
  if (userInfo) {
    const user = userInfo as any;
    res.status(201).json({ success: true, user: user });
  }
};
