import React, { useEffect, useState } from "react";
import axios from "axios";
import LibraryGameCard from "../GameLibraryCard/GameLibraryCard";
import Swal from "sweetalert2"; // 🔔
import "./Library.css";

const Library = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/user-library", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        setGames(res.data);

        if (res.data.length >= 10) {
          try {
            const achievementsRes = await axios.get(
              "http://localhost:5000/api/user-achievements",
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const alreadyUnlocked = achievementsRes.data.some(
              (ach) => ach.id === 3
            );

            if (!alreadyUnlocked) {
              await axios.post(
                "http://localhost:5000/api/unlock-achievement",
                {
                  achievement_id: 3,
                  type: "library",
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              Swal.fire({
                icon: "success",
                title: "Achievement unlocked!",
                text: "You unlocked: Collector 🎮",
                timer: 3000,
                showConfirmButton: false,
              });
            }
          } catch (err) {
            console.error("❌ Error checking/unlocking achievement:", err);
          }
        }
      })
      .catch((err) => console.error("Error loading library:", err));
  }, []);

  return (
    <div className="library-container">
      <div className="library-header">
        <h2>My Library</h2>
        <hr className="separator" />
      </div>

      <div className="library-grid">
        {games.map((game) => (
          <LibraryGameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default Library;
