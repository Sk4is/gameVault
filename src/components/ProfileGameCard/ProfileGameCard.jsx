import React from "react";
import "./ProfileGameCard.css";

const ProfileGameCard = ({ game }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Don't played yet";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Fecha no válida"
      : date.toLocaleString("es-ES", {
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
          Last connection: {formatDate(game.last_connection)}
        </p>
      </div>
      <div className="separator-vertical"></div>
      <div className="playtime">
        <p>
          {game.hours_played && Number(game.hours_played) > 0
            ? `${Number(game.hours_played).toFixed(2)} h`
            : "0.00 h"}
        </p>
      </div>
    </div>
  );
};

export default ProfileGameCard;
