import React, { useState, useEffect } from "react";
import { getToken, removeToken } from "../utils/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import './Style.css';
import Logo from '../assets/logo.svg'
import ProfileImage from '../assets/image-avatar.png';


const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await axios.get("http://localhost:8001/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProfile(response.data); 
        } catch (err) {
          console.error("Failed to fetch profile:", err);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    removeToken(); 
    navigate("/login"); 
  };

  const handleLogoClick = () => {
    navigate("/home"); 
  };

  if (!profile) {
    return (
      <div className="background">
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
    <div className="background">
      <a onClick={handleLogoClick}>
        <img src={Logo} alt="Logo" className="logo" />
      </a>
      <div className="form-container">
        <div className="profile-header">
          <h2>Profile</h2>
          <img src={ProfileImage} alt="Profile" className="profile-img" />
        </div>
        <div className="profile-details">
          <p className="profile-email"><strong>Email:</strong> {profile.email}</p>
          <button onClick={handleLogout} className="form-button">Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
