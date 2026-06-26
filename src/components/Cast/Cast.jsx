import React, { useEffect, useState } from "react";
import { imageUrl } from "../../constants/constants";
import api from "../../lib/api";
import "./Cast.css";

const Cast = ({ movieId }) => {
  const [cast, setCast] = useState([]);

  async function fetchCredits() {
      if (!movieId) return;
      try {
        const res = await api.get(`/movies/${movieId}/credits`);
        setCast(res.data.cast.slice(0, 10)); // top 10 cast
      } catch (err) {
        console.error('Failed fetching credits', err);
        setCast([]);
      }
    }

  useEffect(() => {
    fetchCredits();
  }, [movieId]);

  return (
    <div className="credits-section">
      <h2 className="credits-title">TOP CAST</h2>
      <div className="credits-row">
        {cast.map((person) => (
          <div className="credit-card" key={person.id}>
            <img
              src={
                person.profile_path
                  ? imageUrl + person.profile_path
                  : "/avatar.png"
              }
              alt={person.name}
            />
            <p className="name">{person.name}</p>
            <p className="role">{person.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cast;
