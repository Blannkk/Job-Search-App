import mongoose from "mongoose";

async function connectDB() {
  await mongoose.connect(process.env.DB_URI);
  console.log("Connected to Database...");
}

export default connectDB;
