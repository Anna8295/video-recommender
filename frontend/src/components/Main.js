import React, {useState, useEffect} from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { getToken } from "../utils/auth";
import SearchInput from "./SearchInput";
import BigCard from './BigCard';
import SmallCard from './SmallCard'

const Main = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [makeItLater, setMakeItLater] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  const [movieData, setMovieData] = useState(null); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await axios.get("http://localhost:8001/user-preferences", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMakeItLater(response.data.preferences.make_it_later); 
        } catch (err) {
          console.error("Failed to fetch user preferences:", err);
        }
      }
    };
    fetchUserPreferences();
  }, []);

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await axios.get("http://localhost:8001/recommended-movies", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRecommendedMovies(response.data);
        } catch (err) {
          setError("Error fetching recommended movies");
          console.error("Error fetching recommended movies:", err);
        }
      }
    };

    fetchRecommendedMovies();
  }, [makeItLater]);

  useEffect(() => {
    const handleTrendingMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8001/trending?limit=5`);
        setMovieData(response.data.movies);   
      } catch (err) {
        console.log("Error fetching trending movies");
        setMovieData([]);  
      } finally {
        setLoading(false);  
      }
    };
    handleTrendingMovies();
  }, []);

  const handleMakePreferencesLater = () => {
    navigate("/preferences");
  };

  const handleRecommedkSearch = async (title) => {
    try {
      const response = await axios.get(`http://localhost:8001/movie?title=${title}`);
    } catch (err) {
      setError("Error fetching bookmark data");
    }
  };

  const handleSave = () => {
    console.log("Saved!");
  };

  return (
    <div>
      <SearchInput onSearch={handleRecommedkSearch} placeholder={'Search for movies or TV series'}/>

      <h1>Trending</h1>
      <div className='trending-container'>
        {movieData && movieData.length > 0 ? (
            movieData.map((movie) => (
            <BigCard
                key={movie.imdbID}  
                title={movie.Title}
                year={movie.Year}
                type={movie.Type}
                rating={movie.Rated}
                image={movie.Poster}
                onSave={handleSave}
            />
            ))
        ) : (
            !loading &&  <p>No results found.</p>  
        )}
      </div>
      <h1>Recommended for you</h1>
      <div className="cards-container">
        {recommendedMovies.length === 0 ? (
          <p>No recommended movies available.</p>
        ) : (
          recommendedMovies.map((movie, index) => (
            <SmallCard
              key={index}
              type={'Movie'}
              title={movie.Title}
              year={movie.Year}
              genre={movie.Genre}
              image={movie.Poster}
              rating={movie.Rating}
              onSave={handleSave}
            />
          ))
        )}
      </div>

      {makeItLater && (
        <button onClick={handleMakePreferencesLater} className='choose-button'>
          Set preferences now or later, the choice is yours!
        </button>
      )}
    </div>
  );
};

export default Main;


