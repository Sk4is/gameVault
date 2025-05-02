import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../Contexts/ThemeContext";
import axios from "axios";
import ProfileGameCard from "../ProfileGameCard/ProfileGameCard";
import "./Profile.css";
import AchievementIcon from "../AchievementIcon/AchievementIcon";

const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

const Profile = () => {
  const { darkMode } = useContext(ThemeContext);
  const [username, setUsername] = useState("User");
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [recentGames, setRecentGames] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/user-profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { name, avatar } = response.data;
        if (name) setUsername(name);
        setAvatar(avatar?.trim() ? avatar : DEFAULT_AVATAR);
      })
      .catch((error) =>
        console.error("❌ Error fetching profile data:", error)
      );

    axios
      .get("http://localhost:5000/api/user-library", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const playedGames = res.data.filter(
          (game) => game.hours_played > 0 || game.last_connection !== null
        );
        const top3 = playedGames.slice(0, 3);
        setRecentGames(top3);
      })
      .catch((err) => {
        console.error("❌ Error loading recent games:", err);
      });

    axios
      .get("http://localhost:5000/api/user-achievements", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAchievements(res.data);
      })
      .catch((err) => {
        console.error("❌ Error loading achievements:", err);
      });
  }, []);

  return (
    <>
      <div className={`profile-container ${darkMode ? "dark" : "light"}`}>
        <div className="profile-img">
          <img src={avatar} alt="Profile picture" />
        </div>
        <div className="profile-info">
          <h1>{username}</h1>
        </div>
      </div>

      <hr className="separator" />

      {recentGames.length > 0 && (
        <div className="recent-games-section">
          <h2>Recently Played Games</h2>
          {recentGames.map((game) => (
            <ProfileGameCard key={game.id} game={game} />
          ))}
        </div>
      )}

      {achievements.length > 0 && (
        <div className="achievements-section">
          <h2>Latest Unlocked Achievements</h2>
          <div className="achievements-grid">
            {achievements.map((ach, index) => (
              <div className="achievement-card" key={index}>
                <AchievementIcon
                  id={ach.id}
                  alt={ach.name}
                  className="achievement-icon"
                />
                <div className="achievement-info">
                  <h4>{ach.name}</h4>
                  <p>{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">View All Achievements</button>
        </div>
      )}
    </>
  );
};

export default Profile;
