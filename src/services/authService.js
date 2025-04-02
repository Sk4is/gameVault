// authService.js

import axios from "axios";

const API_URL = "http://localhost:5000";

// Usamos export para exportar la función
export const registerUser = async (nombre, email, password) => {
  return axios.post(`${API_URL}/register`, { nombre, email, password });
};

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  localStorage.setItem("token", response.data.token);
  return response.data.user;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
