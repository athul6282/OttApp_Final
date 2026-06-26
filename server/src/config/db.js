import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectToDatabase() {
  if (!env.mongodbUri) {
    throw new Error("MONGODB_URI is missing. Add it to server/.env.");
  }

  await mongoose.connect(env.mongodbUri);
  console.log("Connected to MongoDB");
}