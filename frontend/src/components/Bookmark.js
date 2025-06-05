import React, {useState} from 'react';
import axios from "axios";

import './search.css'
import SearchInput from "./SearchInput";

const Bookmark = () => {
  const [bookmarkData, setBookmarkData] = useState(null);
  const [error, setError] = useState(null);

  const handleBookmarkSearch = async (title) => {
    try {
      const response = await axios.get(`http://localhost:8001/movie?title=${title}`);
      setBookmarkData(response.data);
      setError(null);
    } catch (err) {
      setError("Error fetching bookmark data");
    }
  };
  return (
    <div>
        <SearchInput onSearch={handleBookmarkSearch} placeholder={'Search for bookmarked shows'}/>

        <h1>Bookmarked Movies</h1>
        {error && <p>{error}</p>}
        {bookmarkData && (
        <div>
            <h2>{bookmarkData.Title}</h2>
            <p>{bookmarkData.Plot}</p>
            <img src={bookmarkData.Poster} alt={bookmarkData.Title} />
        </div>
        )}
        <h1>Bookmarked TV Series</h1>
    </div>
  );
};

export default Bookmark;
