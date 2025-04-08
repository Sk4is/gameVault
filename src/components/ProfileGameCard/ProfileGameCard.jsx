import React from "react";
import "./ProfileGameCard.css";

const ProfileGameCard = ({ game }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="profile-card">
      <img src={game.image} alt={game.title} className="profile-card-img" />
      <div className="profile-card-info">
        <h3 className="game-title">{game.title}</h3>
        <p className="last-connection">
          Última conexión: {formatDate(game.ultima_conexion)}
        </p>
      </div>
      <div className="separator-vertical"></div>
      <div className="playtime">
      <p>{game.horas_jugadas ? Number(game.horas_jugadas).toFixed(2) : "0.00"} h</p>
      </div>
    </div>
  );
};

export default ProfileGameCard;
