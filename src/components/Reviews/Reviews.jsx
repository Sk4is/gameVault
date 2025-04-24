import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "./Reviews.css";

const Review = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ content: "", rating: 1 });
  const [gameName, setGameName] = useState("");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reviews/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUserId(decoded.id);
      setUserRole(decoded.role);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const fetchGameName = async () => {
      try {
        const response = await axios.post(
          "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games",
          `fields name; where id = ${id};`,
          {
            headers: {
              "Client-ID": "yytjvifii8si3zmeshx8znlox2nuc5",
              Authorization: "Bearer vb8e7cupalh6uc0pafce3eikvd9pfs",
            },
          }
        );
        if (response.data.length > 0) setGameName(response.data[0].name);
      } catch (error) {
        console.error("Error fetching game name:", error);
      }
    };
    fetchGameName();
  }, [id]);

  const handleChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${API_URL}/api/reviews`,
        {
          game_id: id,
          game_name: gameName,
          content: newReview.content,
          rating: newReview.rating,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchReviews();
      setNewReview({ content: "", rating: 1 });
      Swal.fire("Thank you!", "Your review has been posted", "success");
    } catch (error) {
      console.error("Error posting review:", error);
      Swal.fire("Error", "Failed to post your review", "error");
    }
  };

  const handleDeleteReview = async (reviewUserId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/api/reviews/${id}/${reviewUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Deleted", "Your review has been deleted", "success");
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      Swal.fire("Error", "Failed to delete the review", "error");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="game-info-page">
      <h1>User Reviews</h1>

      {reviews.length > 0 ? (
        <div className="reviews-container">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <h3 className="review-username">
                  {review.username || "User"}
                </h3>
                <div className="review-rating">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
              <p className="review-content">{review.content}</p>
              {review.published_date && (
                <p className="review-date">
                  <em>Posted: {formatDate(review.published_date)}</em>
                </p>
              )}
              {(userRole === "admin" || review.user_id === userId) && (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteReview(review.user_id)}
                >
                  Delete review
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews available.</p>
      )}

      <motion.img
        src="https://res.cloudinary.com/dimlqpphf/image/upload/v1743343109/image_7_1_rf9fzn.png"
        alt="Arrow"
        className="arrow"
        animate={{ rotate: [0, 15, -15, 15, 0], y: [0, -10, 0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
      />

      <div className="review-form">
        <h2>Write your review</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            name="content"
            placeholder="Write your review..."
            value={newReview.content}
            onChange={handleChange}
            required
          />
          <label>Rating:</label>
          <select
            name="rating"
            value={newReview.rating}
            onChange={handleChange}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} ⭐
              </option>
            ))}
          </select>
          <button type="submit">Submit review</button>
        </form>
      </div>
    </div>
  );
};

export default Review;
