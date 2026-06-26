import { useNavigate } from "react-router-dom";
import { imageUrl } from "../../constants/constants";
import { useWatchlist } from "../../contexts/WatchlistContext";
import "./WatchlistPage.css";

function WatchlistPage() {
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist } = useWatchlist();

  async function handleRemove(event, item) {
    event.stopPropagation();

    try {
      await toggleWatchlist({
        id: item.movieId,
        title: item.title,
        poster_path: item.posterPath,
        backdrop_path: item.backdropPath,
        release_date: item.releaseDate,
        vote_average: item.voteAverage,
        overview: item.overview,
      });
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="watchlist-page">
      <div className="watchlist-heading">
        <h1>My Watchlist</h1>
        <p>Your saved movies are synced in MongoDB and update live across sessions.</p>
      </div>

      <div className="watchlist-grid">
        {watchlist.map((item) => (
          <article
            className="watchlist-card"
            key={item._id}
            onClick={() => navigate(`/movie/${item.movieId}`)}
          >
            <img
              className="watchlist-image"
              src={imageUrl + item.posterPath}
              alt={item.title}
            />
            <div className="watchlist-copy">
              <h3>{item.title}</h3>
              <p>{item.overview}</p>
              <div className="watchlist-meta">
                <span>{item.releaseDate?.slice(0, 4) || "N/A"}</span>
                <span>â­ {item.voteAverage?.toFixed?.(1) || "N/A"}</span>
              </div>
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

export default WatchlistPage;
