import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Profile from "./screens/Profile";
import Home from './screens/Home'
import Preferences from "./screens/Preferences";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;

