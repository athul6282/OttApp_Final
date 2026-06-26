import './App.css';
import { useState } from "react";
import Home from './Pages/Home/Home';
import MovieDetails from './Pages/MovieDetails/MovieDetails';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from './components/Footer/Footer';
import Category from './Pages/Category/Category';
import Login from './Pages/Auth/Login';
import Signup from './Pages/Auth/Signup';
import Header from './components/Header/Header';
import { AuthProvider } from './contexts/AuthContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import WatchlistLinksPage from './Pages/Watchlist/WatchlistLinksPage';
import { FavoritesProvider } from './contexts/FavoritesContext';
import FavoritesPage from './Pages/Favorites/FavoritesPage';


function App() {

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AuthProvider>
      <WatchlistProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <Header
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <Routes>
              <Route path="/" element={<Home showSearch={showSearch}
                searchQuery={searchQuery} />} />
              <Route path="/movie/:movieId" element={<MovieDetails />} />
              <Route path="/category/:category" element={<Category />} />
              <Route path="/watchlist" element={<WatchlistLinksPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </BrowserRouter>
          <Footer />
        </FavoritesProvider>
      </WatchlistProvider>
    </AuthProvider>
  )
}

export default App
