import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { imageUrl } from "../../constants/constants";
import { useWatchlist } from "../../contexts/WatchlistContext";
import api from "../../lib/api";
import "./WatchlistPage.css";

function WatchlistLinksPage() {
  const navigate = useNavigate();
  const { watchlist, removeWatchlistItem, getMovieIdFromLink } = useWatchlist();
  const [movieDetails, setMovieDetails] = useState([]);

  useEffect(() => {
    async function loadWatchlistDetails() {
      const detailRows = await Promise.all(
        watchlist.map(async (item) => {
          const movieId = getMovieIdFromLink(item.movieLink);

          if (!movieId) {
            return { item, movie: null };
          }

          try {
            const response = await api.get(`/movies/${movieId}`);
            return { item, movie: response.data };
          } catch {
            return { item, movie: null };
          }
        })
      );

      setMovieDetails(detailRows);
    }

    loadWatchlistDetails().catch(() => setMovieDetails([]));
  }, [watchlist]);

  async function handleRemove(event, item) {
    event.stopPropagation();

    try {
      await removeWatchlistItem(item._id);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="watchlist-page">
      <div className="watchlist-heading">
        <h1>My Watchlist</h1>
        <p>MongoDB stores only movie and trailer links for each saved item.</p>
      </div>

      <div className="watchlist-grid">
        {movieDetails.map(({ item, movie }) => (
          <article
            className="watchlist-card"
            key={item._id}
            onClick={() => {
              const movieId = getMovieIdFromLink(item.movieLink);
              if (movieId) {
                navigate(`/movie/${movieId}`);
              }
            }}
          >
            <img
              className="watchlist-image"
              src={movie?.poster_path ? imageUrl + movie.poster_path : ""}
              alt={movie?.title || "Saved movie"}
            />
            <div className="watchlist-copy">
              <h3>{movie?.title || "Saved movie"}</h3>
              <p>{movie?.overview || item.movieLink}</p>
              <div className="watchlist-meta">
                <span>{movie?.release_date?.slice(0, 4) || "N/A"}</span>
                <span>Rating {movie?.vote_average?.toFixed?.(1) || "N/A"}</span>
              </div>
              {item.trailerLink && (
                <a
                  href={item.trailerLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                >
                  Trailer
                </a>
              )}
              <button onClick={(event) => handleRemove(event, item)}>Remove</button>
            </div>
          </article>
        ))}
      </div>

      {!watchlist.length && (
        <div className="watchlist-empty">
          <p>Your watchlist is empty.</p>
        </div>
      )}
    </div>
  );
}

export default WatchlistLinksPage;
