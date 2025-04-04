import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../Contexts/ThemeContext";
import "./Settings.css";
import axios from "axios";
import Swal from "sweetalert2";
import * as jwt_decode from "jwt-decode";

const Settings = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    const emailGuardado = localStorage.getItem("emailUsuario");

    if (nombreGuardado) {
      setUsername(nombreGuardado);
    }

    if (emailGuardado) {
      setEmail(emailGuardado);
    }

    const token = localStorage.getItem("token");
    if (token) {
      axios
  .get("http://localhost:5000/api/user-profile", {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((response) => {
    const { nombre, email, foto_perfil } = response.data;
    setUsername(nombre);
    setEmail(email);
    setProfileImage(foto_perfil);

    localStorage.setItem("nombreUsuario", nombre);
    localStorage.setItem("emailUsuario", email);
  })
  .catch((error) => {
    console.error("Error al obtener los datos del perfil:", error);
  });
    }
  }, []);

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
  

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.id;

        const response = await axios.put(
          "http://localhost:5000/api/update-profile",
          {
            id: userId,
            nombre: username,
            email,
            foto_perfil: profileImage,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Swal.fire({
          icon: "success",
          title: "¡Perfil actualizado!",
          text: response.data.message,
          confirmButtonText: "OK",
        });

        localStorage.setItem("nombreUsuario", username);
        localStorage.setItem("emailUsuario", email);
      } catch (error) {
        console.error("Error al guardar el perfil:", error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al guardar los cambios.",
          confirmButtonText: "OK",
        });
      }
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
                src={
                  profileImage ||
                  "https://www.w3schools.com/howto/img_avatar.png"
                }
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
      <button className="save-button" onClick={handleSaveProfile}>
        Guardar Cambios
      </button>
    </div>
  );
};

export default Settings;
