import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../Contexts/ThemeContext";
import axios from "axios";
import ProfileGameCard from "../ProfileGameCard/ProfileGameCard";
import "./Profile.css";

const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

const Profile = () => {
  const { darkMode } = useContext(ThemeContext);
  const [username, setUsername] = useState("Usuario");
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [recentGames, setRecentGames] = useState([]);

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
        setAvatar(avatar?.trim() ? avatar : DEFAULT_AVATAR);
      })
      .catch((error) =>
        console.error("❌ Error al obtener los datos del perfil:", error)
      );

    axios
      .get("http://localhost:5000/api/user-library", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const top3 = res.data.slice(0, 3);
        setRecentGames(top3);
      })
      .catch((err) => {
        console.error("❌ Error al cargar juegos recientes:", err);
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

      {recentGames.length > 0 && (
        <div className="recent-games-section">
          <h2>Últimos juegos jugados</h2>
          {recentGames.map((game) => (
            <ProfileGameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </>
  );
};

export default Profile;
