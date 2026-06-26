import axios from "axios";
import { env } from "../config/env.js";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function buildUrl(path, searchParams = {}) {
  if (!env.tmdbApiKey) {
    throw new Error("TMDB_API_KEY is missing. Add it to server/.env.");
  }

  const params = new URLSearchParams({ api_key: env.tmdbApiKey, language: "en-US" });

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  return `${TMDB_BASE_URL}${path}?${params.toString()}`;
}

async function tmdbFetch(path, searchParams = {}) {
  const url = buildUrl(path, searchParams);

  try {
    const res = await axios.get(url, { timeout: 30000 });
    return res.data;
  } catch (err) {
    if (err.response) {
      const error = new Error(`TMDB request failed with status ${err.response.status}.`);
      error.statusCode = err.response.status;
      throw error;
    }

    if (err.code === "ECONNABORTED") {
      throw new Error("TMDB request timed out.");
    }

    throw err;
  }
}

export const categoryMap = {
  topRated: { path: "/movie/top_rated" },
  action: { path: "/discover/movie", with_genres: 28 },
  adventure: { path: "/discover/movie", with_genres: 12 },
  animation: { path: "/discover/movie", with_genres: 16 },
  comedy: { path: "/discover/movie", with_genres: 35 },
  crime: { path: "/discover/movie", with_genres: 80 },
  documentary: { path: "/discover/movie", with_genres: 99 },
  drama: { path: "/discover/movie", with_genres: 18 },
  family: { path: "/discover/movie", with_genres: 10751 },
  fantasy: { path: "/discover/movie", with_genres: 14 },
  history: { path: "/discover/movie", with_genres: 36 },
  horror: { path: "/discover/movie", with_genres: 27 },
  music: { path: "/discover/movie", with_genres: 10402 },
  mystery: { path: "/discover/movie", with_genres: 9648 },
  romance: { path: "/discover/movie", with_genres: 10749 },
  sciFi: { path: "/discover/movie", with_genres: 878 },
  tvMovie: { path: "/discover/movie", with_genres: 10770 },
  thriller: { path: "/discover/movie", with_genres: 53 },
  war: { path: "/discover/movie", with_genres: 10752 },
  western: { path: "/discover/movie", with_genres: 37 },
};

export async function getTrendingMovies() {
  return tmdbFetch("/trending/movie/day");
}

export async function getMoviesByCategory(category) {
  const config = categoryMap[category];

  if (!config) {
    const error = new Error("Unknown movie category.");
    error.statusCode = 404;
    throw error;
  }

  const { path, ...params } = config;
  return tmdbFetch(path, params);
}

export async function searchMovies(query) {
  return tmdbFetch("/search/movie", { query });
}

export async function getMovieDetails(movieId) {
  return tmdbFetch(`/movie/${movieId}`);
}

export async function getMovieVideos(movieId) {
  return tmdbFetch(`/movie/${movieId}/videos`);
}

export async function getMovieCredits(movieId) {
  return tmdbFetch(`/movie/${movieId}/credits`);
}
