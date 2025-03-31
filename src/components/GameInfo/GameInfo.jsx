import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "./GameInfo.css";

const translateText = async (text) => {
  if (!text) return "";

  const MAX_LENGTH = 500;

  const splitText = (text) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += MAX_LENGTH) {
      chunks.push(text.substring(i, i + MAX_LENGTH));
    }
    return chunks;
  };

  try {
    const textChunks = splitText(text);
    const translatedChunks = await Promise.all(
      textChunks.map(async (chunk) => {
        const response = await axios.get(
          "https://api.mymemory.translated.net/get",
          {
            params: {
              q: chunk,
              langpair: "en|es",
            },
          }
        );

        if (response.data.responseData.translatedText) {
          return response.data.responseData.translatedText;
        } else {
          console.error("Error en la traducción:", response);
          return chunk;
        }
      })
    );

    return translatedChunks.join(" ");
  } catch (error) {
    console.error("Error traduciendo el texto:", error);
    return text;
  }
};

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
        const response = await axios.post(
          "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games",
          `fields name, first_release_date, cover.url, rating, genres.name, summary, platforms.abbreviation, screenshots.url; where id = ${id};`,
          {
            headers: {
              "Client-ID": "yytjvifii8si3zmeshx8znlox2nuc5",
              Authorization: "Bearer vb8e7cupalh6uc0pafce3eikvd9pfs",
            },
          }
        );
  
        const translatedSummary = await translateText(response.data[0].summary);
  
        setGame({
          ...response.data[0],
          summary: translatedSummary,
        });
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
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? game.screenshots.length - 1 : prevIndex - 1
    );
    setZoomedImage(
      game.screenshots[
        currentImageIndex === 0
          ? game.screenshots.length - 1
          : currentImageIndex - 1
      ].url.replace("t_thumb", "t_screenshot_big")
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === game.screenshots.length - 1 ? 0 : prevIndex + 1
    );
    setZoomedImage(
      game.screenshots[
        currentImageIndex === game.screenshots.length - 1
          ? 0
          : currentImageIndex + 1
      ].url.replace("t_thumb", "t_screenshot_big")
    );
  };

  const closeZoomOnClickOutside = (e) => {
    if (e.target.classList.contains("zoomed-image-container")) {
      closeZoom();
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
    return <p>Cargando detalles...</p>;
  }

  const releaseYear = game.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : "Año no disponible";

  return (
    <div className={`game-info-page ${isZoomed ? "zoomed" : ""}`}>
      <div className="game-details">
        <h1>{game.name}</h1>

        <div className="game-summary">
          <h3>Resumen</h3>
          <p>{game.summary || "Resumen no disponible"}</p>
        </div>

        <div className="game-platforms">
          <h3>Plataformas</h3>
          <p>
            {game.platforms?.length
              ? game.platforms
                  .map((platform) => platform.abbreviation)
                  .join(", ")
              : "Plataformas no disponibles"}
          </p>
        </div>

        <div className="game-release-year">
          <h3>Año de lanzamiento</h3>
          <p>{releaseYear}</p>
        </div>

        <div className="game-screenshots">
          <h3>Capturas del juego</h3>
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
            <p>No hay capturas disponibles.</p>
          )}
        </div>
        <button className="add-game" onClick={() => alert(`${game.name} ha sido añadido a tu biblioteca!`)}>Agregar a biblioteca</button>
        <hr className="separator-info"></hr>
      </div>

      {zoomedImage && (
        <div
          className="zoomed-image-container"
          onClick={closeZoomOnClickOutside}
        >
          <span className="close-zoom" onClick={closeZoom}>
            X
          </span>
          <div className="image-container">
            <img src={zoomedImage} alt="Ampliada" className="zoomed-image" />
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
