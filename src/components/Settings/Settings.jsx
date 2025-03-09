import React, { useState, useEffect } from "react";
import "./Settings.css";

const Settings = () => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "Usuario123");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);  

  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="settings-container">
      <h2>Ajustes</h2>

      <div className="settings-item">
        <label>Nombre de usuario:</label>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>

      <div className="settings-item">
        <label>Modo oscuro:</label>
        <button onClick={toggleDarkMode} className="toggle-btn">
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
