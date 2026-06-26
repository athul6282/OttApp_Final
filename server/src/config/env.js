import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5001,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongodbUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  tmdbApiKey: process.env.TMDB_API_KEY || "",
};
