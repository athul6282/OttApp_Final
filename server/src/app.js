import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { authRouter } from "./routes/authRoutes.js";
import { favoriteRouter } from "./routes/favoriteRoutes.js";
import { movieRouter } from "./routes/movieRoutes.js";
import { watchlistRouter } from "./routes/watchlistRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

const allowedOrigins = [
  env.clientUrl,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/movies", movieRouter);
app.use("/api/watchlist", watchlistRouter);

app.use(errorHandler);
