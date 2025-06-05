import React, { useState } from "react";
import axios from "axios";

import SearchInput from "./SearchInput";
import SmallCard from "./SmallCard";

const MovieSearch = () => {
  const [movieData, setMovieData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");  
  const [resultCount, setResultCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleMovieSearch = async (title) => {
    setSearchQuery(title);
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8001/movie?title=${title}&limit=15`);
      setMovieData(response.data.movies);
      setResultCount(response.data.movies.length);
    } catch (err) {
      console.log("Error fetching movie data");
      setMovieData([]);  
      setResultCount(0);
    } finally {
        setLoading(false);  
    }
  };

  const handleSave = () => {
    console.log("Movie saved!");
  };

  return (
    <div>
        <SearchInput onSearch={handleMovieSearch} placeholder={'Search for movies'}/>

        {loading ? (
        <div className="loading-indicator">Loading...</div> 
        ) : (
        <h1>
            {searchQuery 
            ? `Found ${resultCount} result${resultCount !== 1 ? "s" : ""} for '${searchQuery}'` 
            : 'Movies'}
        </h1>
        )}

        <div className="cards-container">
        {movieData && movieData.length > 0 ? (
            movieData.map((movie) => (
            <SmallCard
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
            !loading && searchQuery && <p>No results found.</p>  
        )}
        </div>
    </div>
    );
};

export default MovieSearch;

