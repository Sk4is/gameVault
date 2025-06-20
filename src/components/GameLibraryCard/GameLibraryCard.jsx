import React, { useState } from "react";
import "./GameLibraryCard.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 🔸 Importar useNavigate

const LibraryGameCard = ({ game }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const navigate = useNavigate(); // 🔸 Inicializar

  const handlePlay = () => {
    setIsPlaying(true);
    setStartTime(Date.now());
  };

  const handleCloseGame = async () => {
    const endTime = Date.now();
    const durationMs = endTime - startTime;
    const durationHours = durationMs / (1000 * 60 * 60);
    const totalMinutes = Math.floor(durationMs / (1000 * 60));

    setIsPlaying(false);
    setStartTime(null);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/update-playtime`,
        {
          gameId: game.id,
          duration: durationHours,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/check-played-games`,
        { gameId: game.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.unlocked) {
        Swal.fire({
          icon: "success",
          title: "Achievement unlocked!",
          text: "You unlocked: Active Explorer 🧭",
          timer: 3000,
          showConfirmButton: false,
        });
      }

    } catch (err) {
      console.error("Error saving playtime or unlocking achievement:", err);
    }
  };

  const handleRemove = async () => {
    const token = localStorage.getItem("token");
    try {
      const confirm = await Swal.fire({
        title: "Remove game?",
        text: `Are you sure you want to remove "${game.title}" from your library?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove it",
        cancelButtonText: "Cancel",
      });

      if (confirm.isConfirmed) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/remove-from-library/${game.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Swal.fire("Removed", "Game removed from your library", "success");
        window.location.reload();
      }
    } catch (err) {
      console.error("Error removing game:", err);
      Swal.fire("Error", "Failed to remove the game", "error");
    }
  };

  return (
    <>
      <div className="library-game-card">
        <img src={game.image} alt={game.title} className="library-game-img" />
        <h3 className="library-game-title">{game.title}</h3>
        <hr className="separator" />
        <div className="library-game-btns">
          <button className="library-play-btn" onClick={handlePlay}>
            Play
          </button>
          <button className="library-remove-btn" onClick={handleRemove}>
            Remove
          </button>
        </div>
        <button
          className="library-info-btn"
          onClick={() => navigate(`/gameinfo/${game.id}`)}
        >
          Game Info
        </button>
      </div>

      {isPlaying && (
        <div className="game-overlay">
          <div className="game-overlay-content">
            <h2>Simulating game: {game.title}</h2>
            <button className="close-game-btn" onClick={handleCloseGame}>
              Close Game
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LibraryGameCard;
