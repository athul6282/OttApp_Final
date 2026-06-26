import { Router } from "express";
import {
  addToFavorites,
  listFavorites,
  removeFromFavorites,
} from "../controllers/favoriteController.js";
import { requireAuth } from "../middleware/auth.js";

export const favoriteRouter = Router();

favoriteRouter.use(requireAuth);
favoriteRouter.get("/", listFavorites);
favoriteRouter.post("/", addToFavorites);
favoriteRouter.delete("/:itemId", removeFromFavorites);
