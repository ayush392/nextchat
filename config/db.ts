import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

let isConnected: any;

if (!MONGO_URI) {
  throw new Error("No mongo uri found");
}

async function connect() {
  try {
    if (isConnected) {
      console.log("Using existing connection");
      return isConnected;
    }
    const db = await mongoose.connect(MONGO_URI, {});
    isConnected = db;
    console.log("MongoDB connected");
    return db;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default connect;
