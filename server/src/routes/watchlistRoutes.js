import { Router } from "express";
import {
  addToWatchlist,
  listWatchlist,
  removeFromWatchlist,
} from "../controllers/watchlistController.js";
import { requireAuth } from "../middleware/auth.js";

export const watchlistRouter = Router();

watchlistRouter.use(requireAuth);
watchlistRouter.get("/", listWatchlist);
watchlistRouter.post("/", addToWatchlist);
watchlistRouter.delete("/:itemId", removeFromWatchlist);
