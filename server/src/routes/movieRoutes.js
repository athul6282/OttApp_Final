import { Router } from "express";
import {
  credits,
  details,
  getCategories,
  listByCategory,
  search,
  trending,
  videos,
} from "../controllers/movieController.js";

export const movieRouter = Router();

movieRouter.get("/categories", getCategories);
movieRouter.get("/trending", trending);
movieRouter.get("/search", search);
movieRouter.get("/category/:category", listByCategory);
movieRouter.get("/:movieId", details);
movieRouter.get("/:movieId/videos", videos);
movieRouter.get("/:movieId/credits", credits);
