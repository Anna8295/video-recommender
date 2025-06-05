import React, {useState} from 'react';
import axios from "axios";

import SearchInput from "./SearchInput";
import SmallCard from './SmallCard';

const Series = () => {
  const [serieData, setSerieData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");  
  const [resultCount, setResultCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSeriesSearch = async (title) => {
    setSearchQuery(title);
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8001/series?title=${title}&limit=15`);
      setSerieData(response.data.series);
    } catch (err) {
      console.log("Error fetching tv-serie data");
      setSerieData([]);  
      setResultCount(0);
    } finally {
        setLoading(false);  
    }
  };

  const handleSave = () => {
    console.log("Series saved!");
  };

  return (
    <div>
        <SearchInput onSearch={handleSeriesSearch} placeholder={'Search for TV series'}/>

        {loading ? (
        <div className="loading-indicator">Loading...</div> 
        ) : (
        <h1>
            {searchQuery 
            ? `Found ${resultCount} result${resultCount !== 1 ? "s" : ""} for '${searchQuery}'` 
            : 'TV Series'}
        </h1>
        )}

        <div className="cards-container">
            {serieData && serieData.length > 0 ? (
                serieData.map((series) => (
                <SmallCard 
                    title={series.Title}
                    year={series.Year}
                    type={series.Type}
                    rating={series.Rated}
                    image={series.Poster}
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

export default Series;

