import "dotenv/config";
//require("dotenv").config();
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "";
    await mongoose.connect(mongoURI);
    console.log("Connected to database...");
  } catch (error) {
    console.log("Connection to database error: ", error);
    process.exit(1);
  }
};
