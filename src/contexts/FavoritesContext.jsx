import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import { connectSocket, disconnectSocket } from "../lib/socket";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { currentUser, token } = useAuth();
  const [favorites, setFavorites] = useState([]);

  function buildMovieLink(movieId) {
    return `https://www.themoviedb.org/movie/${movieId}`;
  }

  async function loadFavorites() {
    if (!token) {
      setFavorites([]);
      return;
    }

    const response = await api.get("/favorites");
    setFavorites(response.data.items);
  }

  async function toggleFavorite(movie) {
    if (!token) {
      throw new Error("Please sign in to manage your favorites.");
    }

    const movieLink = buildMovieLink(movie.id);
    const exists = favorites.find((item) => item.movieLink === movieLink);

    if (exists) {
      await api.delete(`/favorites/${exists._id}`);
      setFavorites((current) => current.filter((item) => item._id !== exists._id));
      return false;
    }

    const response = await api.post("/favorites", {
      movieLink,
      title: movie.title || movie.name || movie.original_title || "",
      posterPath: movie.poster_path || movie.posterPath || "",
      releaseDate: movie.release_date || movie.first_air_date || movie.releaseDate || "",
      voteAverage: movie.vote_average ?? movie.voteAverage ?? null,
    });

    setFavorites((current) => [
      response.data.item,
      ...current.filter((item) => item.movieLink !== movieLink),
    ]);
    return true;
  }

  function isFavorite(movieId) {
    return favorites.some((item) => item.movieLink === buildMovieLink(movieId));
  }

  async function removeFavoriteItem(itemId) {
    await api.delete(`/favorites/${itemId}`);
    setFavorites((current) => current.filter((item) => item._id !== itemId));
  }

  useEffect(() => {
    loadFavorites().catch(() => setFavorites([]));
  }, [token]);

  useEffect(() => {
    if (!currentUser || !token) {
      disconnectSocket();
      return undefined;
    }

    const socket = connectSocket(token);
    const handleFavoritesUpdate = () => {
      loadFavorites().catch(() => {});
    };

    socket?.on("favorites:updated", handleFavoritesUpdate);

    return () => {
      socket?.off("favorites:updated", handleFavoritesUpdate);
    };
  }, [currentUser, token]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        loadFavorites,
        toggleFavorite,
        removeFavoriteItem,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
