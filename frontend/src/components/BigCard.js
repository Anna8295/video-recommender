import React, {useState} from "react";
import "./BigCard.css";
import SaveIcon from "../assets/icon-bookmark-empty.svg"; 
import SaveIconFull from "../assets/icon-bookmark-full.svg"; 
import CategoryMovie from '../assets/icon-category-movie.svg'
import CategorySerie from '../assets/icon-category-tv.svg'
import PlaceholderImage from "../assets/large.jpg";

const BigCard = ({ image = PlaceholderImage, title, year, type, rating, onSave }) => {
    const [isSaved, setIsSaved] = useState(false);

    const handleSaveToggle = () => {
        setIsSaved((prev) => !prev);
        if (onSave) onSave(); 
    };

  return (
    <div className="overlay-card">
      <img src={image} alt={title} className="overlay-image" />
      <div className="overlay-content">
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
        <h3 className="overlay-title">{title}</h3>
      </div>
      <div className="save-icon" onClick={handleSaveToggle}>
        <img src={isSaved ? SaveIconFull : SaveIcon} alt="Save" />
      </div>
    </div>
  );
};

export default BigCard;
