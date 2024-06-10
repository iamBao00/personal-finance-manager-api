// database/connection.mjs
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost/personal-finance-manage");
    console.log("Connected to database");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

export default connectDB;
