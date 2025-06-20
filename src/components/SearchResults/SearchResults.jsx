import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import GameCard from "../components/GameCard";
import "./SearchResults.css";

const SearchResults = () => {
  const [games, setGames] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchGames = async () => {
      if (!query || query.trim() === "") return;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_IGDB_PROXY_URL}/https://api.igdb.com/v4/games`,
          `search "${query}"; fields id, name, cover.url, genres.name, summary; limit 20;`,
          {
            headers: {
              "Client-ID": "yytjvifii8si3zmeshx8znlox2nuc5",
              Authorization: "Bearer vb8e7cupalh6uc0pafce3eikvd9pfs",
            },
          }
        );
        setGames(response.data);
      } catch (err) {
        console.error("❌ Error searching for games:", err);
      }
    };

    fetchGames();
  }, [query]);

  return (
    <div className="search-results-page">
      <h2>Results for: "{query}"</h2>
      <div className="games-grid">
        {games.length > 0 ? (
          games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
