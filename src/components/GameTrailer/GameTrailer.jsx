import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./GameTrailer.css";

const getRandomGameWithTrailer = (games) => {
  const gamesWithTrailer = games.filter(game => game.videos?.length > 0);
  const shuffled = gamesWithTrailer.sort(() => 0.5 - Math.random());
  return shuffled[0];
};

const RandomGameCard = () => {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.post(
          "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games",
          `fields name, first_release_date, cover.url, rating, genres.name, summary, platforms.abbreviation, videos.video_id;
           where first_release_date >= 315532800 & first_release_date < 1325376000 & rating >= 85;  
           sort rating desc;
           limit 500;`,
          {
            headers: {
              "Client-ID": "yytjvifii8si3zmeshx8znlox2nuc5",
              Authorization: "Bearer vb8e7cupalh6uc0pafce3eikvd9pfs",
            },
          }
        );

        const randomGameWithTrailer = getRandomGameWithTrailer(response.data);
        setGame(randomGameWithTrailer);
      } catch (error) {
        console.error("Error fetching game:", error);
      }
    };

    fetchGame();
  }, []);

  const getStars = (rating) => {
    if (!rating) return 0;
    return Math.round((rating / 100) * 5);
  };

  const renderStars = (stars) => {
    const fullStar = "★";
    const emptyStar = "☆";
    const starArray = [];
    
    for (let i = 0; i < 5; i++) {
      starArray.push(i < stars ? fullStar : emptyStar);
    }
    
    return starArray.join("");
  };

  if (!game) return <div>Cargando...</div>;

  const trailerId = game.videos?.length > 0 ? game.videos[0].video_id : null;
  const trailerUrl = trailerId ? `https://www.youtube.com/embed/${trailerId}` : null;

  return (
    <div className="random-game-card">
      <h2>{game.name}</h2>
      <div className="game-body">
        {trailerUrl ? (
          <div className="iframe-container">
            <iframe
              width="100%"
              height="100%"
              src={trailerUrl}
              frameBorder="0"
              allowFullScreen
              title={game.name}
            ></iframe>
          </div>
        ) : (
          <p>Trailer no disponible</p>
        )}
        <hr className="separator-popular"></hr>
        <p><strong>Género:</strong> {game.genres?.map(genre => genre.name).join(", ") || "No disponible"}</p>
        <p><strong>Resumen:</strong> {game.summary || "Descripción no disponible"}</p>
        <p><strong>Rating:</strong> {renderStars(getStars(game.rating))}</p>
        <p><strong>Año de lanzamiento:</strong> {game.first_release_date ? new Date(game.first_release_date * 1000).getFullYear() : "Desconocido"}</p>
      </div>
      <div className="game-actions">
        <Link to={`/gameinfo/${game.id}`} className="btn">Más Información</Link>
        <button className="btn" onClick={() => alert(`${game.name} ha sido añadido a tu biblioteca!`)}>Añadir a la biblioteca</button>
      </div>
    </div>
  );
};

export default RandomGameCard;
