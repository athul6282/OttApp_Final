import { WatchlistItem } from "../models/WatchlistItem.js";
import { getSocketServer } from "../config/socket.js";

function emitWatchlistUpdate(userId) {
  const io = getSocketServer();
  if (io) {
    io.to(`user:${userId}`).emit("watchlist:updated");
  }
}

export async function listWatchlist(req, res) {
  const items = await WatchlistItem.find({ user: req.user.sub }).sort({
    createdAt: -1,
  });

  res.json({ items });
}

export async function addToWatchlist(req, res) {
  const { movieLink, trailerLink = "" } = req.body;

  if (!movieLink) {
    return res.status(400).json({ message: "movieLink is required." });
  }

  const movieFields = {
    title: req.body.title || req.body.name || "",
    posterPath: req.body.posterPath || req.body.poster_path || "",
    releaseDate: req.body.releaseDate || req.body.release_date || req.body.first_air_date || "",
    voteAverage: req.body.voteAverage ?? req.body.vote_average ?? null,
  };

  const item = await WatchlistItem.findOneAndUpdate(
    { user: req.user.sub, movieLink },
    {
      user: req.user.sub,
      movieLink,
      trailerLink,
      ...movieFields,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  emitWatchlistUpdate(req.user.sub);
  res.status(201).json({ item });
}

export async function removeFromWatchlist(req, res) {
  await WatchlistItem.findOneAndDelete({
    _id: req.params.itemId,
    user: req.user.sub,
  });

  emitWatchlistUpdate(req.user.sub);
  res.status(204).send();
}
