import React, { useEffect, useRef, useState } from 'react'
import './Videoscard.css'
import { imageUrl } from '../../constants/constants'
import { useNavigate } from "react-router-dom";
import api from '../../lib/api';
import { useWatchlist } from '../../contexts/WatchlistContext';
import { useFavorites } from '../../contexts/FavoritesContext';

function Videocard(props) {

    const [movies, SetMovies] = useState([])
    const cardRef = useRef();
    const navigate = useNavigate();
    const { toggleWatchlist, isInWatchlist } = useWatchlist();
    const { toggleFavorite, isFavorite } = useFavorites();



    async function FetchMovies() {
        const response = await api.get(`/movies/category/${props.category}`)
        const data = await response.data;
        SetMovies(data.results.filter(movie => movie.poster_path !== null));
    }
    async function HandleClick(id) {
        navigate(`/movie/${id}`)
    }


    const handleScroll = (direction) => {
        if (cardRef.current) {
            const cardWidth = 260;
            const gap = 10;
            const scrollAmount = (cardWidth + gap) * 5;

            cardRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    }
    async function handleWatchlistClick(event, movie) {
        event.stopPropagation();

        try {
            await toggleWatchlist(movie);
        } catch (error) {
            alert(error.message);
        }
    }
    async function handleFavoriteClick(event, movie) {
        event.stopPropagation();

        try {
            await toggleFavorite(movie);
        } catch (error) {
            alert(error.message);
        }
    }
    useEffect(() => { FetchMovies() }, [])
    return (
        <div className='row'>
            <div className='row-header'>
                <h1>{props.title}</h1>
                {props.category && (
                    <button
                        className="see-more"
                        onClick={() => navigate(`/category/${props.category}`)}
                    >See More →</button>
                )}
            </div>
            <button className="scroll-btn scroll-left" onClick={() => handleScroll('left')}>❮</button>
            <div className='posters' ref={cardRef}>

                {movies.map((movie) =>
                    <div
                        className="poster-card"
                        key={movie.id}
                        onClick={() => HandleClick(movie.id)}
                    >
                        <img
                            className="poster-img"
                            src={imageUrl + movie.poster_path}
                            alt='posterImage'
                        />

                        <div className="poster-hover">
                            <h3>{movie.name || movie.title}</h3>

                            <div className="hover-actions">
                                <button className="watch-btn" onClick={() => navigate(`/movie/${movie.id}`)}>▶ Watch</button>
                                <button className="add-btn" onClick={(event) => handleWatchlistClick(event, movie)}>
                                    {isInWatchlist(movie.id) ? 'Saved' : '+'}
                                </button>
                                <button className="add-btn" onClick={(event) => handleFavoriteClick(event, movie)}>
                                    {isFavorite(movie.id) ? 'Liked' : '♡'}
                                </button>
                            </div>

                            <p className="meta">
                                ⭐ {movie.vote_average?.toFixed(1)} • {(movie.first_air_date || movie.release_date)?.slice(0, 4)} • <span className='certificate'>{movie.adult ? 'A' : 'U/A'}</span>
                            </p>

                            <p className="overview">
                                {movie.overview}
                            </p>
                        </div>
                    </div>



                )}

            </div>
            <button className="scroll-btn scroll-right" onClick={() => handleScroll('right')}>❯</button>

        </div>
    )
}

export default Videocard
