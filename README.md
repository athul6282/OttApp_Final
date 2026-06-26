# Streamify

Streamify is a movie discovery web application built with a React frontend and a Node.js backend. The app uses TMDB for movie data, trailers, posters, categories, search results, cast details, and movie information. It also includes a custom backend for user accounts, JWT authentication, watchlists, and favorites.

## Features

- Browse trending movies and category-based movie rows
- View movie details, cast information, posters, ratings, and trailers
- Search for movies
- Register and login users
- Authenticate users with JSON Web Tokens
- Save movies to a personal watchlist
- Save movies to a personal favorites list
- Store user data, watchlist items, and favorites in MongoDB
- Sync watchlist and favorites updates with Socket.IO

## Platforms And Technologies Used

### Frontend

- React 19 for building the user interface
- Vite for fast development and production builds
- React Router for page navigation
- Axios for API requests
- React Icons for UI icons
- React YouTube for trailer playback
- Socket.IO Client for live update events
- CSS for styling and responsive layouts

### Backend

- Node.js runtime
- Express.js for REST API routes
- MongoDB for database storage
- Mongoose for database models and queries
- JSON Web Token for authentication
- bcryptjs for password hashing
- CORS for allowing frontend-backend communication
- Socket.IO for real-time user list updates
- dotenv for environment variables

### External APIs And Services

- TMDB API for movie data, images, trailers, search, categories, credits, and details
- TMDB image CDN for posters and backdrop images
- YouTube for trailer playback
- MongoDB Atlas or local MongoDB for database hosting

## Project Structure

```text
New project/
├── src/                 # React frontend
│   ├── components/      # Header, hero banner, movie cards, footer, cast
│   ├── contexts/        # Auth, watchlist, and favorites state
│   ├── lib/             # API and socket helpers
│   └── Pages/           # Home, auth, category, movie details, lists
├── server/              # Node.js backend
│   └── src/
│       ├── config/      # Environment, database, socket setup
│       ├── controllers/ # Auth, movies, watchlist, favorites logic
│       ├── middleware/  # JWT auth and error handling
│       ├── models/      # MongoDB models
│       ├── routes/      # API routes
│       └── utils/       # TMDB and JWT helpers
└── public/              # Static frontend assets
```

## API Responsibilities

The backend handles:

- User registration
- User login
- Password hashing
- JWT token creation and verification
- Protected user routes
- Watchlist storage
- Favorites storage
- Proxying movie requests to TMDB

Main API route groups:

```text
/api/auth
/api/movies
/api/watchlist
/api/favorites
/api/health
```

## Environment Variables

Create a `.env` file in the project root for the frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-long-random-jwt-secret
TMDB_API_KEY=your-tmdb-api-key
```

Do not commit real API keys, database passwords, or JWT secrets.

## How To Run The Project

Install frontend dependencies from the project root:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

Start the backend server:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
npm run dev
```

Open the frontend URL shown by Vite, usually:

```text
http://localhost:5173
```

## Build

To create a production frontend build:

```bash
npm run build
```

The production output is generated in the `dist` folder.

## Notes

- The frontend calls the backend through `VITE_API_URL`.
- The backend calls TMDB using `TMDB_API_KEY`.
- If movie data does not load, make sure the backend is running and listening on the same port used by `VITE_API_URL`.
- If port `5000` is already in use, change both `server/.env` and the root `.env` to use the same new backend port.
