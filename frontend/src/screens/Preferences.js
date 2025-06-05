import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "./Style.css";

const genres = ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western']
const actors = ['Nicolas Cage', 'Robert De Niro', 'Bruce Willis', 'Samuel L. Jackson', 'Tom Hanks', 'Liam Neeson', 'Johnny Depp', 'Mark Wahlberg', 'Matt Damon', 'Adam Sandler', 'Mel Gibson', 'Dennis Quaid', 'Morgan Freeman', 'Clint Eastwood', 'John Wayne']
  

const Preferences = () => {
  const [currentStep, setCurrentStep] = useState(1); 
  const [preferences, setPreferences] = useState({ moviesOrSeries: [], genres: [], actors: [] });
  const [preferencesCompleted, setPreferencesCompleted] = useState(false);
  const [makeItLater, setMakeItLater] = useState(false);
  const navigate = useNavigate();

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

  const handleNext = async () => {
    const token = getToken();
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else if(token) {
        try {
          const payload = {
            movie_or_series: preferences.moviesOrSeries,
            category: preferences.genres, 
            actors: preferences.actors, 
          };
          await axios.post("http://localhost:8001/preferences", 
              payload,
              {
                headers: { Authorization: `Bearer ${token}`}
              }
          );
            console.log("Preferences saved:", payload);
            navigate("/home");
        } catch (err) {
            console.error("Error saving preferences:", err);
        }
    }
  };

  const handleMakeItLater = async () => {
    const token = getToken();
    if(token){
      try {
        await axios.post("http://localhost:8001/preferences-later", 
          {},
          {
            headers: { Authorization: `Bearer ${token}`}
          }
        );
        console.log("Preferences skipped and marked as completed.");
        navigate("/home");
      } catch (err) {
        console.error("Error saving preferences:", err);
      }
    }
  };

  const handleToggle = (category, option) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: prev[category].includes(option)
        ? prev[category].filter((item) => item !== option)
        : [...prev[category], option],
    }));
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return preferences.moviesOrSeries.length === 0;
    if (currentStep === 2) return preferences.genres.length < 3;
    if (currentStep === 3) return preferences.actors.length < 3;
    return false;
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <h2>What do you prefer?</h2>
          <div className="choose-group">
            <button
              className={`choose-button ${preferences.moviesOrSeries.includes("Movies") ? "selected" : ""}`}
              onClick={() => handleToggle("moviesOrSeries", "Movies")}
            >
              Movies
            </button>
            <button
              className={`choose-button ${preferences.moviesOrSeries.includes("Series") ? "selected" : ""}`}
              onClick={() => handleToggle("moviesOrSeries", "Series")}
            >
              Series
            </button>
          </div>
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <h2>Select Your Favorite Genres</h2>
          <div className="choose-group">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`choose-button ${preferences.genres.includes(genre) ? "selected" : ""}`}
                onClick={() => handleToggle("genres", genre)}
              >
                {genre}
              </button>
            ))}
          </div>
          <p>Select at least 3 genres</p>
        </>
      );
    }

    if (currentStep === 3) {
      return (
        <>
          <h2>Select Your Favorite Actors</h2>
          <div className="choose-groupe">
            {actors.map((actor) => (
              <button
                key={actor}
                className={`choose-button ${preferences.actors.includes(actor) ? "selected" : ""}`}
                onClick={() => handleToggle("actors", actor)}
              >
                {actor}
              </button>
            ))}
          </div>
          <p>Select at least 3 actors</p>
        </>
      );
    }
  };

  return (
    <div className="background">
      <div className="form-container">
        {!makeItLater ? (
          <a 
            href="#"
            className="make-it-later-link"
            onClick={handleMakeItLater}
          >
            Make it Later
          </a>
        ) : null }
        {renderStepContent()}
        <button
          onClick={handleNext}
          className="form-button"
          disabled={isNextDisabled()}
        >
          {currentStep < 3 ? "Next" : "Finish"}
        </button>
      </div>
    </div>
  );
};

export default Preferences;
