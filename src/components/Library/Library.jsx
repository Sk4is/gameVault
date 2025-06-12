import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import LibraryGameCard from "../GameLibraryCard/GameLibraryCard";
import Swal from "sweetalert2";
import "./Library.css";

const Library = () => {
  const [games, setGames] = useState([]);
  const hasChecked = useRef(false);

  useEffect(() => {
    const fetchLibrary = async () => {
      if (hasChecked.current) return;
      hasChecked.current = true;

      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user-library`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setGames(res.data);

        if (res.data.length >= 10) {
          const achievementsRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/user-achievements`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const alreadyUnlocked = achievementsRes.data.some(
            (ach) => ach.id === 3
          );

          if (!alreadyUnlocked) {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/unlock-achievement`,
              {
                achievement_id: 3,
                type: "library",
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            Swal.fire({
              icon: "success",
              title: "Achievement unlocked!",
              text: "You unlocked: Collector 🎮",
              timer: 3000,
              showConfirmButton: false,
            });
          }
        }
      } catch (err) {
        console.error("❌ Error checking/unlocking achievement:", err);
      }
    };

    fetchLibrary();
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
