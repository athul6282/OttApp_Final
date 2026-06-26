import './Header.css'
import logo from '../../assets/Logo.png'
import search from '../../assets/Search icon.svg'
import bell from '../../assets/bell.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWatchlist } from '../../contexts/WatchlistContext';
import { useFavorites } from '../../contexts/FavoritesContext';

const Header = ({
  showSearch,
  setShowSearch,
  searchQuery,
  setSearchQuery,
}) => {
  const location = useLocation()
  const isMovieDetailPage = location.pathname.includes('/movie/')

  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { watchlistCount } = useWatchlist();
  const { favoritesCount } = useFavorites();

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    setMenuOpen(false);
  };

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchQuery(inputValue.trim());
      setMenuOpen(false);
    }
  };



  return (
    <>
      <div className='header'>
        <div className='nav-left'>
          <img className='logo' src={logo} onClick={() => navigate("/")} />
        </div>

        <div className='nav-right'>
          {showSearch && (
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search movies..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button className="clear-search" onClick={handleClear}>×</button>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
          <ul className={menuOpen ? 'nav-menu open' : 'nav-menu'}>
            <li><a onClick={() => { navigate("/"); setMenuOpen(false); }}>Home</a></li>
            <li><a onClick={() => { const el = document.getElementById('movies-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }}>Movies</a></li>
            <li>
              <div className="dropdown">
                <span className="dropdown-trigger">Categories ▾</span>
                <div className="dropdown-menu">
                  <span onClick={() => { navigate("/category/topRated"); setMenuOpen(false); }}>
                    Top Rated
                  </span>
                  <span onClick={() => { navigate("/category/action"); setMenuOpen(false); }}>
                    Action
                  </span>
                  <span onClick={() => { navigate("/category/comedy"); setMenuOpen(false); }}>
                    Comedy
                  </span>
                  <span onClick={() => { navigate("/category/sciFi"); setMenuOpen(false); }}>
                    Sci-Fi
                  </span>
                  <span onClick={() => { navigate("/category/war"); setMenuOpen(false); }}>
                    War
                  </span>
                  <span onClick={() => { navigate("/category/adventure"); setMenuOpen(false); }}>
                    Adventure
                  </span>
                  <span onClick={() => { navigate("/category/crime"); setMenuOpen(false); }}>
                    Crime
                  </span>
                  <span onClick={() => { navigate("/category/drama"); setMenuOpen(false); }}>
                    Drama
                  </span>
                  <span onClick={() => { navigate("/category/documentary"); setMenuOpen(false); }}>
                    Documentary
                  </span>
                  <span onClick={() => { navigate("/category/family"); setMenuOpen(false); }}>
                    Family
                  </span>
                  <span onClick={() => { navigate("/category/fantasy"); setMenuOpen(false); }}>
                    Fantasy
                  </span>
                  <span onClick={() => { navigate("/category/history"); setMenuOpen(false); }}>
                    History
                  </span>
                  <span onClick={() => { navigate("/category/music"); setMenuOpen(false); }}>
                    Music
                  </span>
                  <span onClick={() => { navigate("/category/mystery"); setMenuOpen(false); }}>
                    Mystery
                  </span>
                  <span onClick={() => { navigate("/category/romance"); setMenuOpen(false); }}>
                    Romance
                  </span>
                  <span onClick={() => { navigate("/category/tvMovie"); setMenuOpen(false); }}>
                    TV Movie
                  </span>
                  <span onClick={() => { navigate("/category/western"); setMenuOpen(false); }}>
                    Western
                  </span>
                </div>
              </div>
            </li>
            {currentUser && <li><a onClick={() => { navigate("/watchlist"); setMenuOpen(false); }}>Watchlist ({watchlistCount})</a></li>}
            {currentUser && <li><a onClick={() => { navigate("/favorites"); setMenuOpen(false); }}>Favorites ({favoritesCount})</a></li>}
            {!isMovieDetailPage && (
              <li><a href='#'><img src={search} alt="Search"
                className="search-icon"
                onClick={handleSearchToggle} /></a></li>
            )}
            <li><a href='#'><img src={bell} onClick={() => setMenuOpen(false)} /></a></li>
            {currentUser && <li><a href='#' onClick={() => { logout(); setMenuOpen(false); }}>Logout</a></li>}
          </ul>
          
          {currentUser ? (
            <span>Hello, {currentUser.name}</span>
          ) : (
            <Link to="/login">Sign In</Link>
          )}
            
        </div>
      </div>
    </>
  )
}

export default Header
