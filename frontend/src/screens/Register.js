import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import './Style.css';
import Logo from '../assets/logo.svg'

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState(null);
  const [inputErrors, setInputErrors] = useState({ email: false, password: false, repeatPassword: false, passwordMismatch: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (password && repeatPassword && password !== repeatPassword) {
      setInputErrors((prev) => ({
        ...prev,
        passwordMismatch: true
      }));
    } else {
      setInputErrors((prev) => ({
        ...prev,
        passwordMismatch: false
      }));
    }
  }, [password, repeatPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8001/register", {
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError("Registration failed.");
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
        <h2>Sign in</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
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
          <div className="input-group">
            <input
              type="password"
              placeholder="Repeat Password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              onBlur={() => handleBlur("repeatPassword")}
              className={inputErrors.repeatPassword || inputErrors.passwordMismatch ? "error-input" : ""}
              required
            />
            {inputErrors.repeatPassword && <span className="error-text">Can't be empty.</span>}
            {inputErrors.passwordMismatch && <span className="error-text">Passwords do not match.</span>}
          </div>
          <button type="submit" className="form-button">Create an account</button>
          <p className="text-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
