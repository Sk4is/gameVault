import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ClassicGames.css";

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`custom-arrow prev ${className}`}
      style={{ ...style, display: "block", left: "0px" }}
      onClick={onClick}
    >
      &#8249;
    </div>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`custom-arrow next ${className}`}
      style={{ ...style, display: "block", right: "33px" }}
      onClick={onClick}
    >
      &#8250;
    </div>
  );
};

const getRandomGames = (games, count) => {
  const shuffled = games.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const GameCarousel = () => {
  const [games, setGames] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.post(
          "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games",
          `fields name, first_release_date, cover.url, rating, genres.name, summary, platforms.abbreviation;
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

        setGames(getRandomGames(response.data, 20));
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  const getStars = (rating) => {
    if (!rating) return 0;
    return Math.round((rating / 100) * 5);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: true,
    centerPadding: "0px",
    beforeChange: (current, next) => setActiveIndex(next),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <>
      <h1 className="classic-title">Juegos Clásicos</h1>
      <hr className="separator"></hr>
      <div className="carousel-container">
        <Slider {...settings}>
          {games.length === 0 ? (
            <p>Cargando juegos...</p>
          ) : (
            games.map((game, index) => (
              <Link to={`/gameinfo/${game.id}`} key={game.id}>
                <div
                  key={game.id}
                  className={`game-card ${index === activeIndex ? "active" : ""}`}
                >
                  <img
                    src={game.cover?.url.replace("t_thumb", "t_cover_big")}
                    alt={game.name}
                    loading="lazy"
                  />
                  <div className="game-info">
                    <h3>{game.name}</h3>
                    <p className="description">
                      Resumen: {game.summary || "Descripción no disponible"}
                    </p>
                    <p className="platforms">
                      Plataformas:{" "}
                      {game.platforms?.length
                        ? game.platforms.map((platform) => platform.abbreviation).join(", ")
                        : "Plataformas no disponibles"}
                    </p>
                    <div className="rating-year">
                      <div className="stars">
                        {"★".repeat(getStars(game.rating))}
                      </div>
                      <div className="year">
                        {game.first_release_date
                          ? new Date(game.first_release_date * 1000).getFullYear()
                          : "Desconocido"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </Slider>
      </div>
    </>
  );
};

export default GameCarousel;
