// src/pages/Library.jsx
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
        console.log("✅ Datos recibidos:", res.data);
        setGames(res.data);
      })
      .catch((err) => console.error("Error al cargar biblioteca:", err));
  }, []);

  return (
    <div className="library-container">
      <div className="library-header">
        <h2>Mi Biblioteca</h2>

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
