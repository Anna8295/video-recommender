import React, { useState } from "react";
import "./SmallCard.css";
import SaveIcon from "../assets/icon-bookmark-empty.svg"; 
import SaveIconFull from "../assets/icon-bookmark-full.svg"; 
import CategoryMovie from '../assets/icon-category-movie.svg'
import CategorySerie from '../assets/icon-category-tv.svg'

const SmallCard = ({ image, title, year, type, rating, onSave }) => {
    const [isSaved, setIsSaved] = useState(false);

    const handleSaveToggle = () => {
        setIsSaved((prev) => !prev);
        if (onSave) onSave(); 
    };

  return (
    <div className="movie-card">
      <div className="image-container">
        <img src={image} alt={title} className="movie-image" />
        <div className="save-icon" onClick={handleSaveToggle}>
            <img src={isSaved ? SaveIconFull : SaveIcon} alt="Save" />
        </div>
      </div>
      <div className="movie-info">
        <div className="details">
          <span>{year}</span>
          <span className="separator">•</span>
          <img
            src={type === "Movie" ? CategoryMovie : CategorySerie}
            alt={type}
            className="category-icon"
          />
          <span>{type}</span>
          <span className="separator">•</span>
          <span>{rating}</span>
        </div>
        <h3 className="movie-title">{title}</h3>
      </div>
    </div>
  );
};

export default SmallCard;
