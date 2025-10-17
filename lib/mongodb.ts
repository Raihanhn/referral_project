import mongoose from "mongoose";

declare global {
 
  var _mongoClientPromise: Promise<typeof mongoose> | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in env");

async function connect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  return mongoose.connect(MONGODB_URI, {
    
  });
}

export default connect;
