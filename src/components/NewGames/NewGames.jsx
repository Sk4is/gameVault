import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./NewGames.css";

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

const getStars = (rating) => {
  if (rating === null || rating === undefined || isNaN(rating)) {
    return 0;
  }

  const maxRating = 5;
  const ratingPercentage = (rating / 100) * maxRating;
  return Math.round(ratingPercentage);
};

const GameCarousel = () => {
  const [games, setGames] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const now = Math.floor(Date.now() / 1000);

        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        twoYearsAgo.setMonth(0);
        twoYearsAgo.setDate(1);
        const twoYearsAgoTimestamp = Math.floor(twoYearsAgo.getTime() / 1000);

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/new-games`);

        const shuffleArray = (array) => {
          let shuffledArray = [...array];
          for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [
              shuffledArray[j],
              shuffledArray[i],
            ];
          }
          return shuffledArray;
        };

        const shuffledGames = shuffleArray(response.data).slice(0, 20);

        setGames(shuffledGames);
      } catch (error) {
        console.error("Error fetching new games:", error);
      }
    };

    fetchGames();
  }, []);

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
  {
    breakpoint: 1024,
    settings: {
      slidesToShow: 3,
      slidesToScroll: 1,
      centerMode: false,
    },
  },
  {
    breakpoint: 600,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 1,
      centerMode: false,
    },
  },
],
  };

  return (
    <>
      <h1 className="newgame-title">New Releases</h1>
      <hr className="separator-popular"></hr>
      <div className="carousel-container">
        <Slider {...settings}>
          {games.length === 0 ? (
            <p>Loading games...</p>
          ) : (
            games.map((game, index) => (
              <Link to={`/gameinfo/${game.id}`} key={game.id}>
                <div
                  key={game.id}
                  className={`game-card ${
                    index === activeIndex ? "active" : ""
                  }`}
                >
                  <img
                    src={game.cover?.url.replace("t_thumb", "t_cover_big")}
                    alt={game.name}
                    loading="lazy"
                  />
                  <div className="game-info">
                    <h3>{game.name}</h3>
                    <p className="genre">
                      <strong>Genre:</strong>{" "}
                      {game.genres?.map((genre) => genre.name).join(", ") ||
                        "Unknown"}
                    </p>
                    <p className="description">
                      <strong>Summary:</strong>{" "}
                      {game.summary
                        ? game.summary.substring(0, 150) + "..."
                        : "Not available"}
                    </p>
                    <p className="platforms">
                      <strong>Platforms:</strong>{" "}
                      {game.platforms?.length
                        ? game.platforms
                            .map((platform) => platform.abbreviation)
                            .join(", ")
                        : "Not available"}
                    </p>
                    <div className="rating-year">
                      <div className="stars">
                        {"★".repeat(getStars(game.rating)) || "★".repeat(0)}
                      </div>
                      <div className="year">
                        {game.first_release_date
                          ? new Date(
                              game.first_release_date * 1000
                            ).getFullYear()
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
