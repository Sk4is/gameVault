import React, { useEffect, useState } from "react";
import axios from "axios";
import LibraryGameCard from "../GameLibraryCard/GameLibraryCard";
import "./Library.css";

const Library = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/user-library", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("✅ Data received:", res.data);
        setGames(res.data);
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
