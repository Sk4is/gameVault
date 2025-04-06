import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

  const handleAddToLibrary = async () => {
    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Error", "Debes iniciar sesión", "error");
  
    try {
      await axios.post(
        "http://localhost:5000/api/add-to-library",
        { gameId: game.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      Swal.fire("¡Añadido!", "Juego guardado en tu biblioteca", "success");
    } catch (error) {
      console.error("❌ Error al añadir a biblioteca:", error);
      Swal.fire("Error", error.response?.data?.message || "Algo salió mal", "error");
    }
  };  

  if (!game) return <div>Cargando...</div>;

  const trailerId = game.videos?.length > 0 ? game.videos[0].video_id : null;
  const trailerUrl = trailerId ? `https://www.youtube.com/embed/${trailerId}` : null;

  return (
    <>
    <h1 className="popular-title">Trailers Juegos Populares</h1>
    <div className="arrow-container">
    <motion.img
  src="https://res.cloudinary.com/dimlqpphf/image/upload/v1743342428/image_4_1_eutjge.png"
  alt="Arrow"
  className="arrow-left"
  animate={{ y: [0, -10, 0, -5, 0] }} 
  transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
/>

<motion.img
  src="https://res.cloudinary.com/dimlqpphf/image/upload/v1743342644/image_4_2_uiwrkb.png"
  alt="Arrow"
  className="arrow-right"
  animate={{ y: [0, -10, 0, -5, 0] }} 
  transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
/>


</div>
      <motion.div 
      className="random-game-card"
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2>{game.name}</h2>
      <div className="game-body">
        {trailerUrl ? (
          <motion.div 
            className="iframe-container"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <iframe
              width="100%"
              height="100%"
              src={trailerUrl}
              frameBorder="0"
              allowFullScreen
              title={game.name}
            ></iframe>
          </motion.div>
        ) : (
          <p>Trailer no disponible</p>
        )}
        <hr className="separator-popular"></hr>
        <p><strong>Género:</strong> {game.genres?.map(genre => genre.name).join(", ") || "No disponible"}</p>
        <p><strong>Resumen:</strong> {game.summary || "Descripción no disponible"}</p>
        <p><strong>Rating:</strong> <span className="stars">{renderStars(getStars(game.rating))}</span></p>
        <p><strong>Año de lanzamiento:</strong> {game.first_release_date ? new Date(game.first_release_date * 1000).getFullYear() : "Desconocido"}</p>
      </div>
      <motion.div 
        className="game-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Link to={`/gameinfo/${game.id}`} className="btn">Más Información</Link>
        <button className="btn" onClick={handleAddToLibrary}>Añadir a la biblioteca</button>
      </motion.div>
    </motion.div>
    </>
  );
};

export default RandomGameCard;
