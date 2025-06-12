import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import Swal from "sweetalert2";
import "./GameInfo.css";

const GameInfoPage = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/game-details/${id}`);

        setGame(response.data);
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    fetchGameDetails();
  }, [id]);

  const handleImageClick = (imageUrl, index) => {
    setZoomedImage(imageUrl);
    setIsZoomed(true);
    setCurrentImageIndex(index);
  };

  const closeZoom = () => {
    setIsZoomed(false);
    setZoomedImage(null);
    setCurrentImageIndex(0);
  };

  const goToPreviousImage = () => {
    const prevIndex =
      currentImageIndex === 0 ? game.screenshots.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setZoomedImage(game.screenshots[prevIndex].url.replace("t_thumb", "t_screenshot_big"));
  };

  const goToNextImage = () => {
    const nextIndex =
      currentImageIndex === game.screenshots.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(nextIndex);
    setZoomedImage(game.screenshots[nextIndex].url.replace("t_thumb", "t_screenshot_big"));
  };

  const closeZoomOnClickOutside = (e) => {
    if (e.target.classList.contains("zoomed-image-container")) {
      closeZoom();
    }
  };

  const handleAddToLibrary = async () => {
    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Error", "You must be logged in", "error");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/add-to-library`,
        {
          gameId: game.id,
          name: game.name,
          description: game.summary || null,
          genre: game.genres?.map(g => g.name).join(", ") || null,
          platform: game.platforms?.map(p => p.abbreviation).join(", ") || null,
          image: game.cover?.url?.replace("t_thumb", "t_cover_big") || null,
          releaseDate: game.first_release_date
            ? new Date(game.first_release_date * 1000).toISOString().split("T")[0]
            : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Game added to your library",
        showConfirmButton: false,
        timer: 1500,
      });

    } catch (error) {
      console.error("❌ Error adding to library:", error);
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  if (!game) {
    return <p>Loading game details...</p>;
  }

  const releaseYear = game.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : "Year not available";

  return (
    <div className={`game-info-page ${isZoomed ? "zoomed" : ""}`}>
      <div className="game-details">
        <h1>{game.name}</h1>

        <div className="game-summary">
          <h3>Summary</h3>
          <p>{game.summary || "Summary not available"}</p>
        </div>

        <div className="game-platforms">
          <h3>Platforms</h3>
          <p>
            {game.platforms?.length
              ? game.platforms.map((platform) => platform.abbreviation).join(", ")
              : "Platforms not available"}
          </p>
        </div>

        <div className="game-release-year">
          <h3>Release Year</h3>
          <p>{releaseYear}</p>
        </div>

        <div className="game-screenshots">
          <h3>Screenshots</h3>
          {game.screenshots?.length > 0 ? (
            <Slider {...settings}>
              {game.screenshots.map((screenshot, index) => (
                <div key={screenshot.id} className="screenshot-item">
                  <img
                    src={screenshot.url.replace("t_thumb", "t_screenshot_big")}
                    alt="Screenshot"
                    onClick={() =>
                      handleImageClick(
                        screenshot.url.replace("t_thumb", "t_screenshot_big"),
                        index
                      )
                    }
                    className="thumbnail-image"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <p>No screenshots available.</p>
          )}
        </div>

        <button className="add-game" onClick={handleAddToLibrary}>
          Add to Library
        </button>

        <hr className="separator-info" />
      </div>

      {zoomedImage && (
        <div className="zoomed-image-container" onClick={closeZoomOnClickOutside}>
          <span className="close-zoom" onClick={closeZoom}>
            X
          </span>
          <div className="image-container">
            <img src={zoomedImage} alt="Zoomed" className="zoomed-image" />
          </div>
        </div>
      )}

      {zoomedImage && (
        <div className="image-navigation">
          <button className="nav-button left" onClick={goToPreviousImage}>
            {"<"}
          </button>
          <button className="nav-button right" onClick={goToNextImage}>
            {">"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GameInfoPage;
