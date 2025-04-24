import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PopularGameCarousel.css";

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

const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
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

        const random20Games = shuffleArray(response.data).slice(0, 20);
        setGames(random20Games);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

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
      <img
        className="ciberpunk"
        src="https://res.cloudinary.com/dimlqpphf/image/upload/v1743107638/Proyecto_nuevo_1_qjdcih.jpg"
        alt="Cyberpunk City"
      />
      <h1 className="popular-title">Featured Games</h1>
      <hr className="separator"></hr>
      <div className="carousel-container">
        <Slider {...settings}>
          {games.length === 0 ? (
            <p>Loading games...</p>
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
                    <p className="genres">
                      Genres:{" "}
                      {game.genres?.length
                        ? game.genres.map((genre) => genre.name).join(", ")
                        : "Not available"}
                    </p>
                    <p className="description">
                      Summary: {game.summary || "No description available"}
                    </p>
                    <p className="platforms">
                      Platforms:{" "}
                      {game.platforms?.length
                        ? game.platforms.map((platform) => platform.abbreviation).join(", ")
                        : "Not available"}
                    </p>
                    <div className="rating-year">
                      <div className="stars">
                        {"★".repeat(getStars(game.rating)) || "★".repeat(0)}
                      </div>
                      <div className="year">
                        {game.first_release_date
                          ? new Date(game.first_release_date * 1000).getFullYear()
                          : "Unknown"}
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
