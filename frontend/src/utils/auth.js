import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "user_token";

// Save JWT to localStorage
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get JWT from localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove JWT from localStorage
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Decode the JWT to get user info (if needed)
export const getUserFromToken = () => {
  const token = getToken();
  if (token) {
    return jwtDecode(token);
  }
  return null;
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};
