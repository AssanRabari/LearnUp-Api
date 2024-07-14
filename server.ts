import { app } from "./app";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./utils/db";
require("dotenv").config();

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.COULD_API_KEY,
  api_secret: process.env.COULD_SECRET_KEY,
});

app.listen(process.env.PORT, () => {
  console.log("Server is running");
  connectDB();
});
