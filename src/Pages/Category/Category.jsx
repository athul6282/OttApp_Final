import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { imageUrl } from "../../constants/constants";
import { categoryTitles } from "../../urls";
import { useWatchlist } from "../../contexts/WatchlistContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import "./Category.css";

const Category = ({ searchQuery, title: propTitle }) => {
  const { category } = useParams();
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const { toggleFavorite, isFavorite } = useFavorites();
  const title = propTitle || categoryTitles[category] || category?.toUpperCase();

  useEffect(() => {
    async function fetchCategoryMovies() {
      try {
        setError("");
        const response = searchQuery
          ? await api.get(`/movies/search?q=${encodeURIComponent(searchQuery)}`)
          : await api.get(`/movies/category/${category}`);

        setMovies(response.data.results || []);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Failed to load movies.");
        setMovies([]);
      }
    }

    fetchCategoryMovies();
  }, [category, searchQuery]);

  async function handleWatchlistClick(event, movie) {
    event.stopPropagation();

    try {
      await toggleWatchlist(movie);
    } catch (watchlistError) {
      alert(watchlistError.message);
    }
  }

  async function handleFavoriteClick(event, movie) {
    event.stopPropagation();

    try {
      await toggleFavorite(movie);
    } catch (favoriteError) {
      alert(favoriteError.message);
    }
  }

  return (
    <div className="category-page">
      <h1 className="category-title">{title}</h1>
      {error && <p className="category-empty">{error}</p>}

      <div className="category-grid">
        {movies.map((movie) => (
          <div className="category-card" key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)}>
            <img
              src={imageUrl + movie.poster_path}
              alt={movie.title}
              className="category-img"
            />
            <div className="category-hover">
              <h3>{movie.title}</h3>
              <div className="hover-actions">
                <button className="watch-btn" onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}>▶ Watch</button>
                <button
                  className="add-btn"
                  onClick={(event) => handleWatchlistClick(event, movie)}
                >
                  {isInWatchlist(movie.id) ? "Saved" : "+"}
                </button>
                <button
                  className="add-btn"
                  onClick={(event) => handleFavoriteClick(event, movie)}
                >
                  {isFavorite(movie.id) ? "Liked" : "♡"}
                </button>
              </div>
              <p className="meta">
                ⭐ {movie.vote_average?.toFixed(1)} • {(movie.release_date)?.slice(0, 4)} • <span className='certificate'>{movie.adult ? 'A' : 'U/A'}</span>
              </p>
              <p className="overview">
                {movie.overview}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
