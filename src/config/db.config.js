import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn_url =
      process.env.DB_URI || "mongodb://localhost:27017/assetflowv2";
    await mongoose.connect(conn_url);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

export default connectDB;
