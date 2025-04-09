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

    const totalMinutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    setIsPlaying(false);
    setStartTime(null);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/update-playtime",
        {
          gameId: game.id,
          duration: durationHours,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Juego cerrado",
        text: `Has jugado ${hours}h ${minutes}min.`,
      });
    } catch (err) {
      console.error("Error al guardar las horas jugadas:", err);
    }
  };

  const handleRemove = async () => {
    const token = localStorage.getItem("token");
    try {
      const confirm = await Swal.fire({
        title: "¿Eliminar juego?",
        text: `¿Seguro que deseas quitar "${game.title}" de tu biblioteca?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (confirm.isConfirmed) {
        await axios.delete(
          `http://localhost:5000/api/remove-from-library/${game.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Swal.fire("Eliminado", "Juego eliminado de tu biblioteca", "success");
        window.location.reload();
      }
    } catch (err) {
      console.error("Error al eliminar juego:", err);
      Swal.fire("Error", "No se pudo eliminar el juego", "error");
    }
  };

  return (
    <>
      <div className="library-game-card">
        <img src={game.image} alt={game.title} className="library-game-img" />
        <h3 className="library-game-title">{game.title}</h3>
        <hr className="separator"></hr>
        <div className="library-game-btns">
          <button className="library-play-btn" onClick={handlePlay}>
            Jugar
          </button>
          <button className="library-remove-btn" onClick={handleRemove}>
            Eliminar
          </button>
        </div>
        <button
          className="library-info-btn"
          onClick={() => (window.location.href = `/gameinfo/${game.id}`)}
        >
          Info juego
        </button>
      </div>

      {isPlaying && (
        <div className="game-overlay">
          <div className="game-overlay-content">
            <h2>Simulando juego: {game.title}</h2>
            <button className="close-game-btn" onClick={handleCloseGame}>
              Cerrar juego
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LibraryGameCard;
