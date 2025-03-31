import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "./Reviews.css";

const Review = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    username: "",
    title: "",
    content: "",
    rating: 1,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reviews/${id}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error obteniendo las reseñas:", error);
      }
    };

    fetchReviews();
  }, [id]);

  const handleChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/reviews", {
        game_id: id,
        ...newReview,
      });
      setReviews([...reviews, response.data]);
      setNewReview({ username: "", title: "", content: "", rating: 1 });
    } catch (error) {
      console.error("Error enviando la reseña:", error);
    }
  };

  return (
    <div className="game-info-page">
      <motion.img
  src="https://res.cloudinary.com/dimlqpphf/image/upload/v1743343109/image_7_1_rf9fzn.png"
  alt="Arrow"
  className="arrow"
  animate={{
    rotate: [0, 15, -15, 15, 0],
    y: [0, -10, 0, -5, 0],
  }}
  transition={{
    repeat: Infinity,
    duration: 1,
    ease: "easeInOut",
  }}
/>


      <h1>Reseñas de los usuarios</h1>

      {reviews.length > 0 ? (
        <div className="reviews-container">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <h3 className="review-username">{review.username || "Usuario desconocido"}</h3>
                <div className="review-rating">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
              {review.title && <h4 className="review-title">{review.title}</h4>}
              <p className="review-content">{review.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay reseñas disponibles.</p>
      )}

      <div className="review-form">
        <h2>Escribe tu reseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Tu nombre"
            value={newReview.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="title"
            placeholder="Título de la reseña (opcional)"
            value={newReview.title}
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="Escribe tu reseña..."
            value={newReview.content}
            onChange={handleChange}
            required
          />
          <label>Calificación:</label>
          <select name="rating" value={newReview.rating} onChange={handleChange}>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} ⭐
              </option>
            ))}
          </select>
          <button type="submit">Enviar reseña</button>
        </form>
      </div>
    </div>
  );
};

export default Review;
