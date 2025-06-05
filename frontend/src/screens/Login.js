import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/auth";


import './Style.css';
import Logo from '../assets/logo.svg'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [inputErrors, setInputErrors] = useState({ email: false, password: false });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8001/login", {
        email,
        password,
      });
      const token = response.data;
      saveToken(token);

      getProfile(token); 
    } catch (err) {
      setError("Invalid email or password.");
    }
  };


  const getProfile = async (token) => {
    try {
      const userResponse = await axios.get("http://localhost:8001/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });  
      const { preferences_set } = userResponse.data;  
      if (preferences_set === false) {
        navigate("/preferences");  
      } else {
        navigate("/home");  
      }
    } catch (err) {
      setError("Failed to fetch profile.");
    }
  };
  

  const handleBlur = (field) => {
    setInputErrors((prev) => ({
      ...prev,
      [field]: !eval(field) 
    }));
  };

  return (

    <div className="background">
      <img src={Logo} alt="Logo" className="logo" />
      <div className="form-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              className={inputErrors.email ? "error-input" : ""}
              required
            />
            {inputErrors.email && <span className="error-text">Can't be empty.</span>}
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              className={inputErrors.password ? "error-input" : ""}
              required
            />
            {inputErrors.password && <span className="error-text">Can't be empty.</span>}
          </div>
          <button type="submit" className="form-button">Login to your account</button>
          <p className="text-link">
            Don’t have an account? <a href="/register">Sign up</a>
          </p>
        </form>
      </div>
    </div> 
  );
};

export default Login;

  