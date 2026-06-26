import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import { connectSocket, disconnectSocket } from "../lib/socket";
import { useAuth } from "./AuthContext";

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const { currentUser, token } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  function buildMovieLink(movieId) {
    return `https://www.themoviedb.org/movie/${movieId}`;
  }

  function buildTrailerLink(trailerKey) {
    return trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : "";
  }

  function getMovieIdFromLink(movieLink) {
    const match = movieLink?.match(/\/movie\/(\d+)/);
    return match ? Number(match[1]) : null;
  }

  async function loadWatchlist() {
    if (!token) {
      setWatchlist([]);
      return;
    }

    const response = await api.get("/watchlist");
    setWatchlist(response.data.items);
  }

  async function toggleWatchlist(movie) {
    if (!token) {
      throw new Error("Please sign in to manage your watchlist.");
    }

    const movieLink = buildMovieLink(movie.id);
    const exists = watchlist.find((item) => item.movieLink === movieLink);

    if (exists) {
      await api.delete(`/watchlist/${exists._id}`);
      setWatchlist((current) => current.filter((item) => item._id !== exists._id));
      return false;
    }

    const response = await api.post("/watchlist", {
      movieLink,
      trailerLink: buildTrailerLink(movie.trailerKey ?? movie.trailer_key),
      title: movie.title || movie.name || movie.original_title || "",
      posterPath: movie.poster_path || movie.posterPath || "",
      releaseDate: movie.release_date || movie.first_air_date || movie.releaseDate || "",
      voteAverage: movie.vote_average ?? movie.voteAverage ?? null,
    });

    setWatchlist((current) => [
      response.data.item,
      ...current.filter((item) => item.movieLink !== movieLink),
    ]);
    return true;
  }

  function isInWatchlist(movieId) {
    return watchlist.some((item) => item.movieLink === buildMovieLink(movieId));
  }

  async function removeWatchlistItem(itemId) {
    await api.delete(`/watchlist/${itemId}`);
    setWatchlist((current) => current.filter((item) => item._id !== itemId));
  }

  useEffect(() => {
    loadWatchlist().catch(() => setWatchlist([]));
  }, [token]);

  useEffect(() => {
    if (!currentUser || !token) {
      disconnectSocket();
      return undefined;
    }

    const socket = connectSocket(token);
    const handleWatchlistUpdate = () => {
      loadWatchlist().catch(() => {});
    };

    socket?.on("watchlist:updated", handleWatchlistUpdate);

    return () => {
      socket?.off("watchlist:updated", handleWatchlistUpdate);
    };
  }, [currentUser, token]);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        watchlistCount: watchlist.length,
        loadWatchlist,
        toggleWatchlist,
        removeWatchlistItem,
        isInWatchlist,
        getMovieIdFromLink,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
