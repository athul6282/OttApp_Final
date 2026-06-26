import {
  categoryMap,
  getMovieCredits,
  getMovieDetails,
  getMoviesByCategory,
  getMovieVideos,
  getTrendingMovies,
  searchMovies,
} from "../utils/tmdb.js";

export function getCategories(req, res) {
  res.json({ categories: Object.keys(categoryMap) });
}

export async function listByCategory(req, res) {
  const data = await getMoviesByCategory(req.params.category);
  res.json(data);
}

export async function trending(req, res) {
  const data = await getTrendingMovies();
  res.json(data);
}

export async function search(req, res) {
  const data = await searchMovies(req.query.q || "");
  res.json(data);
}

export async function details(req, res) {
  const data = await getMovieDetails(req.params.movieId);
  res.json(data);
}

export async function videos(req, res) {
  const data = await getMovieVideos(req.params.movieId);
  res.json(data);
}

export async function credits(req, res) {
  const data = await getMovieCredits(req.params.movieId);
  res.json(data);
}
