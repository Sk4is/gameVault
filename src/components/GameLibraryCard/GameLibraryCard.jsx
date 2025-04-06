import React, { useState } from "react";
import "./GameLibraryCard.css";
import Swal from "sweetalert2";
import axios from "axios";

const LibraryGameCard = ({ game }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const handlePlay = () => {
    setIsPlaying(true);
    setStartTime(Date.now());
  };

  const handleCloseGame = async () => {
    const endTime = Date.now();
    const durationMs = endTime - startTime;
    const durationHours = durationMs / (1000 * 60 * 60);

    setIsPlaying(false);
    setStartTime(null);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/update-playtime", {
        gameId: game.id,
        duration: durationHours,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: "success",
        title: "Juego cerrado",
        text: `Has jugado ${durationHours.toFixed(2)} horas.`,
      });
    } catch (err) {
      console.error("Error al guardar las horas jugadas:", err);
    }
  };

  return (
    <>
      <div className="library-game-card">
        <img src={game.image} alt={game.title} className="library-game-img" />
        <h3 className="library-game-title">{game.title}</h3>
        <button className="library-play-btn" onClick={handlePlay}>
          Jugar
        </button>
      </div>

      {isPlaying && (
        <div className="game-overlay">
          <div className="game-overlay-content">
            <h2>Simulando juego: {game.title}</h2>
            <button onClick={handleCloseGame}>Cerrar juego</button>
          </div>
        </div>
      )}
    </>
  );
};

export default LibraryGameCard;
