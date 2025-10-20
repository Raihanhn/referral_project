import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) throw new Error("MONGODB_URI missing in .env.local");

let isConnected = false;

export default async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
    return mongoose;
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    throw error;
  }
}
