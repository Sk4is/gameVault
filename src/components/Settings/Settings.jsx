// src/pages/SettingsPage.jsx
import React, { useContext, useState } from 'react';
import { ThemeContext } from '../Contexts/ThemeContext'; // Importamos el ThemeContext
import './Settings.css';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext); // Accedemos a darkMode y toggleDarkMode
  const [username, setUsername] = useState("Nombre Usuario");
  const [email, setEmail] = useState("usuario@gmail.com");
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`settings-container ${darkMode ? "dark" : "light"}`}>
      <h2 className="title">CONFIGURACIÓN</h2>
      <div className="settings-content">
        <div className="left-panel">
          <label className="profile-label">FOTO DE PERFIL:</label>
          <div className="profile-pic-container">
            <div className="profile-pic">
              <img
                src={profileImage || "https://www.w3schools.com/howto/img_avatar.png"}
                alt="Profile"
              />
            </div>
            <button
              className="change-photo-button"
              onClick={() => document.getElementById("fileInput").click()}
            >
              Cambiar foto de perfil
            </button>
          </div>
          <input
            id="fileInput"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />

          <label className="field-label">NOMBRE DE USUARIO:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />

          <label className="field-label">CORREO ELECTRÓNICO:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          />
        </div>

        <div className="separator-popular"></div>

        <div className="right-panel">
          <label className="mode-label">MODO CLARO / OSCURO</label>
          <div className="toggle-container" onClick={toggleDarkMode}>
            <span className="sun">☀️</span>
            <div className={`toggle-switch ${darkMode ? "" : "active"}`}></div>
            <span className="moon">🌙</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
