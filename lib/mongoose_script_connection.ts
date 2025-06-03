import mongoose from "mongoose";
import dotenv from "dotenv";

// This is intended to only be used for running node scripts. The mongooseConnect module is intended for use with
// Next.js rather than this one.

dotenv.config();

mongoose.set("debug", false);

mongoose.connection.on("error", (e) => {
  console.error("MongoDB connection error:", e);
});

export const connectToDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.debug(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.debug("MongoDB disconnected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
