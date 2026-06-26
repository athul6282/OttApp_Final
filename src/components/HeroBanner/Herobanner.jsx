import React, { useEffect, useState } from 'react'
import './Herobanner.css'
import YouTube from 'react-youtube'
import { useParams } from 'react-router-dom'
import { imageUrl, GENRE_MAP } from '../../constants/constants'
import api from '../../lib/api'
import { useWatchlist } from '../../contexts/WatchlistContext'
import { useFavorites } from '../../contexts/FavoritesContext'

const Herobanner = () => {
    const [movie, SetMovie] = useState({})
    const { movieId } = useParams()
    const [videoId, SetVideoId] = useState('')
    const [showModal, SetShowModal] = useState(false)
    const { toggleWatchlist, isInWatchlist } = useWatchlist()
    const { toggleFavorite, isFavorite } = useFavorites()
    const genres = movie.genre_ids ? movie.genre_ids.map(id => GENRE_MAP[id]).join(' • ') : '';


    async function MovieFetch() {
        const response = movieId
            ? await api.get(`/movies/${movieId}`)
            : await api.get('/movies/trending');
        const data = response.data;
        if (movieId) {
            SetMovie(data)
        } else {
            SetMovie(data.results[15])
        }
    }
    async function HandleTrailer() {
        if (!movie.id) {
            return;
        }

        const response = await api.get(`/movies/${movie.id}/videos`)
        const data = response.data;

        if (data.results.length !== 0) {
            SetVideoId(data.results[0].key)
            SetShowModal(true)
        }
    }

    const opts = {
        playerVars: {
            autoplay: 1,
            origin: window.location.origin,
        },
    };

    useEffect(() => { MovieFetch() }, [movieId])

    async function handleWatchlist() {
        try {
            let trailerKey = videoId;

            if (!trailerKey && movie.id) {
                const response = await api.get(`/movies/${movie.id}/videos`);
                trailerKey = response.data.results?.[0]?.key || "";
            }

            await toggleWatchlist({ ...movie, trailerKey })
        } catch (error) {
            alert(error.message)
        }
    }

    async function handleFavorite() {
        try {
            await toggleFavorite(movie)
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <>
            <div className='herobanner' style={{ backgroundImage: `url(${imageUrl + movie.backdrop_path})` }}>

                <div className="hero-overlay"></div>

                <div className='hero-content'>
                    <h1 className='hero-title'>{movie.original_title}</h1>

                    <div className='hero-badges'>
                        <span className='badge'>Movie</span>
                        <span className='badge'>CC</span>
                        <span>{genres}</span>
                        <span className="badge"> ⭐ {movie.vote_average?.toFixed(1)}</span>
                    </div>

                    <div className='hero-buttons'>
                        <button className='btn btn-watch' onClick={HandleTrailer}>Watch</button>
                        <button className='btn btn-trailer' onClick={HandleTrailer}>Trailer</button>
                        <button className='btn btn-trailer' onClick={handleWatchlist}>
                            {isInWatchlist(movie.id) ? 'In Watchlist' : 'Add to Watchlist'}
                        </button>
                        <button className='btn btn-trailer' onClick={handleFavorite}>
                            {isFavorite(movie.id) ? 'Favorited' : 'Favorite'}
                        </button>
                    </div>

                    <div className="hero-info">
                        <span>By Jon Favreau</span>
                        <span>|</span>
                        <span>2h 5min</span>
                    </div>
                    <p className="hero-description">
                        {movie.overview}
                    </p>
                </div>

            </div>

            {showModal && (
                <div className="video-modal" onClick={() => SetShowModal(false)}>
                    <div className="video-container" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => SetShowModal(false)}>✕</button>
                       <div className='youtube-wrapper'> {videoId && <YouTube videoId={videoId} opts={opts} />} </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Herobanner
