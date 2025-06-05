import React, { useState } from "react";
import './search.css';
import SearchIcon from '../assets/icon-search.svg';

const SearchInput = ({ onSearch, placeholder }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (title.trim()) {
      try {
        await onSearch(title);  
        setError(null);
      } catch (err) {
        setError("Error during search");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <img src={SearchIcon} alt="search" />
      <input
        type="text"
        className={`custom-input ${title ? 'typing' : ''}`}
        placeholder={placeholder}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyPress} 
      />
      {error && <p>{error}</p>}
    </div>
  );
};

export default SearchInput;
