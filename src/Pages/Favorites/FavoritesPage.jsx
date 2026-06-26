import { useNavigate } from "react-router-dom";
import { imageUrl } from "../../constants/constants";
import { useFavorites } from "../../contexts/FavoritesContext";
import "../Watchlist/WatchlistPage.css";

function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, removeFavoriteItem } = useFavorites();

  function getMovieIdFromLink(movieLink) {
    const match = movieLink?.match(/\/movie\/(\d+)/);
    return match ? Number(match[1]) : null;
  }

  async function handleRemove(event, item) {
    event.stopPropagation();

    try {
      await removeFavoriteItem(item._id);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="watchlist-page">
      <div className="watchlist-heading">
        <h1>My Favorites</h1>
        <p>Your favorite movies are stored in MongoDB for your account.</p>
      </div>

      <div className="watchlist-grid">
        {favorites.map((item) => {
          const movieId = getMovieIdFromLink(item.movieLink);

          return (
            <article
              className="watchlist-card"
              key={item._id}
              onClick={() => movieId && navigate(`/movie/${movieId}`)}
            >
              <img
                className="watchlist-image"
                src={item.posterPath ? imageUrl + item.posterPath : ""}
                alt={item.title || "Favorite movie"}
              />
              <div className="watchlist-copy">
                <h3>{item.title || "Favorite movie"}</h3>
                <p>{item.movieLink}</p>
                <div className="watchlist-meta">
                  <span>{item.releaseDate?.slice(0, 4) || "N/A"}</span>
                  <span>Rating {item.voteAverage?.toFixed?.(1) || "N/A"}</span>
                </div>
                <button onClick={(event) => handleRemove(event, item)}>Remove</button>
              </div>
            </article>
          );
        })}
      </div>

      {!favorites.length && (
        <div className="watchlist-empty">
          <p>Your favorites list is empty.</p>
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
