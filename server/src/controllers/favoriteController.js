import { getSocketServer } from "../config/socket.js";
import { FavoriteItem } from "../models/FavoriteItem.js";

function emitFavoritesUpdate(userId) {
  const io = getSocketServer();
  if (io) {
    io.to(`user:${userId}`).emit("favorites:updated");
  }
}

function getMovieFields(body) {
  return {
    title: body.title || body.name || "",
    posterPath: body.posterPath || body.poster_path || "",
    releaseDate: body.releaseDate || body.release_date || body.first_air_date || "",
    voteAverage: body.voteAverage ?? body.vote_average ?? null,
  };
}

export async function listFavorites(req, res) {
  const items = await FavoriteItem.find({ user: req.user.sub }).sort({
    createdAt: -1,
  });

  res.json({ items });
}

export async function addToFavorites(req, res) {
  const { movieLink } = req.body;

  if (!movieLink) {
    return res.status(400).json({ message: "movieLink is required." });
  }

  const item = await FavoriteItem.findOneAndUpdate(
    { user: req.user.sub, movieLink },
    {
      user: req.user.sub,
      movieLink,
      ...getMovieFields(req.body),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  emitFavoritesUpdate(req.user.sub);
  res.status(201).json({ item });
}

export async function removeFromFavorites(req, res) {
  await FavoriteItem.findOneAndDelete({
    _id: req.params.itemId,
    user: req.user.sub,
  });

  emitFavoritesUpdate(req.user.sub);
  res.status(204).send();
}
