import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PopularGameCarousel.css";

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`custom-arrow prev ${className}`}
      style={{ ...style, display: "block", left: "10px" }}
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
      style={{ ...style, display: "block", right: "10px" }}
      onClick={onClick}
    >
      &#8250;
    </div>
  );
};

const GameCarousel = () => {
  const [games, setGames] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.post(
          "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games",
          `fields name, first_release_date, cover.url, rating, genres.name, summary, platforms.abbreviation; sort rating desc; limit 500;`,
          {
            headers: {
              "Client-ID": "yytjvifii8si3zmeshx8znlox2nuc5",
              Authorization: "Bearer vb8e7cupalh6uc0pafce3eikvd9pfs",
            },
          }
        );

        const shuffledGames = shuffleArray(response.data);
        const gamesWithImages = shuffledGames.filter((game) => game.cover?.url);
        setGames(gamesWithImages.slice(0, 20));
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const ciberpunkImage = document.querySelector(".ciberpunk");
      if (!ciberpunkImage) return;

      const rect = ciberpunkImage.getBoundingClientRect();
      console.log("getBoundingClientRect:", rect);

      const windowHeight = window.innerHeight;

      const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
      const imageHeight = rect.height;
      const visibilityRatio = visibleHeight / imageHeight;

      console.log(`Visibilidad: ${visibilityRatio * 100}%`);

      if (visibilityRatio >= 0.5) {
        ciberpunkImage.classList.add("scrolled");
      } else {
        ciberpunkImage.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const shuffleArray = (array) => {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getStars = (rating) => {
    if (rating === null || rating === undefined) {
      return 0;
    }
    const maxRating = 5;
    const ratingPercentage = (rating / 100) * maxRating;
    return Math.round(ratingPercentage);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
    <h1 className="popular-title">Popular Games</h1>
    <hr class="separator"></hr>
    <div className="carousel-container">
      <Slider {...settings}>
        {games.length === 0 ? (
          <p>Cargando juegos...</p>
        ) : (
          games.map((game, index) => (
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
                <p className="genre">
                  Genres:{" "}
                  {game.genres?.length
                    ? game.genres.map((genre) => genre.name).join(", ")
                    : "Sin categoría"}
                </p>
                <p className="description">
                  Summary: {game.summary || "Descripción no disponible"}
                </p>
                <p className="platforms">
                  Platforms:{" "}
                  {game.platforms?.length
                    ? game.platforms
                        .map((platform) => platform.abbreviation)
                        .join(", ")
                    : "Plataformas no disponibles"}
                </p>
                <div className="rating-developer">
                  <div className="stars">
                    {"★".repeat(getStars(game.rating)) || "★".repeat(0)}
                  </div>
                  <div className="developer">
                    {game.developers?.[0]?.name || "Desarrollador desconocido"}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </Slider>
    </div>
    <img className="ciberpunk" src="https://res.cloudinary.com/dimlqpphf/image/upload/v1743104194/cyberpunk-night-city-bttwc9wki8cqtvkj_1_q3hjay.jpg" alt="Ciberpunk city" />
    </>
  );
};

export default GameCarousel;
