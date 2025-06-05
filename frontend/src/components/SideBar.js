import React, {useState} from "react";
import { Link } from "react-router-dom"; 

import Logo from '../assets/logo.svg';
import Home from '../assets/Icons/nav-home';
import Movie from '../assets/Icons/nav-movie';
import Series from '../assets/Icons/nav-series';
import Bookmark from '../assets/Icons/nav-bookmark';
import ProfileImage from '../assets/image-avatar.png';

import './Sidebar.css';

const Sidebar = ({ activeContent, onLinkClick }) => {
    const [hoveredLink, setHoveredLink] = useState(null);

    const handleMouseEnter = (link) => {
      setHoveredLink(link);
    };
  
    const handleMouseLeave = () => {
      setHoveredLink(null);
    };
  
    const getColor = (link) => {
      if (activeContent === link) {
        return 'white';  
      } else if (hoveredLink === link) {
        return '#FC4747'; 
      } else {
        return '#5A698F'; 
      }
    };
  return (
    <div className="sidebar">
      <img src={Logo} alt="Logo" className="nav-logo"/>
      <nav>
        <ul>
          <li>
            <Link 
                to="#" 
                onClick={() => onLinkClick('main')}
                onMouseEnter={() => handleMouseEnter('main')}
                onMouseLeave={handleMouseLeave}
            >
              <Home color={getColor('main')}/>
            </Link>
          </li>
          <li>
            <Link 
                to='#' 
                onClick={() => onLinkClick('movies')}
                onMouseEnter={() => handleMouseEnter('movies')}
                onMouseLeave={handleMouseLeave}
            >
                <Movie color={getColor('movies')}/>
            </Link>
          </li>
          <li>
            <Link 
                to="#" 
                onClick={() => onLinkClick('series')}
                onMouseEnter={() => handleMouseEnter('series')}
                onMouseLeave={handleMouseLeave}
            >
              <Series color={getColor('series')}/>
            </Link>
          </li>
          <li>
            <Link 
                to="#" 
                onClick={() => onLinkClick('bookmark')}
                onMouseEnter={() => handleMouseEnter('bookmark')}
                onMouseLeave={handleMouseLeave}
            >
              <Bookmark color={getColor('bookmark')}/>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <Link to="/profile">
          <img src={ProfileImage} alt="User Profile" className="profile-image" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

