import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../Contexts/ThemeContext";
import axios from "axios";
import "./Profile.css";

const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

const Profile = () => {
  const { darkMode } = useContext(ThemeContext);
  const [username, setUsername] = useState("Usuario");
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/user-profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { nombre, avatar } = response.data;

        if (nombre) setUsername(nombre);
        if (avatar && avatar.trim() !== "") {
          setAvatar(avatar);
          console.log("✅ Avatar cargado desde la base de datos");
        } else {
          console.log("ℹ️ Avatar no encontrado, usando el predeterminado");
          setAvatar(DEFAULT_AVATAR);
        }
      })
      .catch((error) => {
        console.error("❌ Error al obtener los datos del perfil:", error);
      });
  }, []);

  return (
    <>
      <div className={`profile-container ${darkMode ? "dark" : "light"}`}>
        <div className="profile-img">
          <img src={avatar} alt="Foto de perfil" />
        </div>
        <div className="profile-info">
          <h1>{username}</h1>
        </div>
      </div>
      <hr className="separator" />
    </>
  );
};

export default Profile;
