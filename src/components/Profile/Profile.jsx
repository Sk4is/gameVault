import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../Contexts/ThemeContext";
import axios from "axios";
import ProfileGameCard from "../ProfileGameCard/ProfileGameCard";
import "./Profile.css";
import AchievementIcon, { iconMap } from "../AchievementIcon/AchievementIcon";
import Swal from "sweetalert2";

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
      .get(`${import.meta.env.VITE_API_URL}/api/user-profile`, {
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
      .get(`${import.meta.env.VITE_API_URL}/api/user-library`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const playedGames = res.data.filter(
          (game) => game.hours_played > 0 || game.last_connection !== null
        );
        setRecentGames(playedGames.slice(0, 3));
      })
      .catch((err) => {
        console.error("❌ Error loading recent games:", err);
      });

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user-achievements`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.unlocked_at) - new Date(a.unlocked_at)
        );
        const uniqueAchievements = Array.from(
          new Map(sorted.map((a) => [a.id, a])).values()
        );
        setAchievements(uniqueAchievements);

        const alreadyUnlocked = uniqueAchievements.some((ach) => ach.id === 5);
        if (!alreadyUnlocked) {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/unlock-achievement`,
              {
                achievement_id: 5,
                type: "profile",
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            Swal.fire({
              icon: "success",
              title: "Achievement unlocked!",
              text: "You unlocked: Personal Renewal 🌱",
              timer: 3000,
              showConfirmButton: false,
            });

            const updated = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/user-achievements`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const sortedUpdated = updated.data.sort(
              (a, b) => new Date(b.unlocked_at) - new Date(a.unlocked_at)
            );
            const uniqueUpdated = Array.from(
              new Map(sortedUpdated.map((a) => [a.id, a])).values()
            );
            setAchievements(uniqueUpdated);
          } catch (err) {
            console.error("❌ Error unlocking profile achievement:", err);
          }
        }
      })
      .catch((err) => {
        console.error("❌ Error loading achievements:", err);
      });
  }, []);

  const handleViewAllAchievements = () => {
    if (achievements.length === 0) return;

    const htmlContent = `
    <div class="achievement-modal-grid" style="display: flex; flex-wrap: wrap; gap: 16px; justify-content: center;">
      ${achievements
        .map(
          (ach) => `
        <div class="achievement-modal-card" style="flex: 0 1 200px; background: ${
          darkMode ? "#1e1e1e" : "#f9f9f9"
        }; border-radius: 8px; padding: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 8px;">
            ${iconMap[ach.id] || "⭐"}
          </div>
          <strong>${ach.name}</strong>
          <p style="font-size: 0.9rem; color: ${darkMode ? "#ccc" : "#444"};">${
            ach.description
          }</p>
        </div>
      `
        )
        .join("")}
    </div>
  `;

    Swal.fire({
      title: "All Achievements",
      html: htmlContent,
      width: "800px",
      background: darkMode ? "#2e2e2e" : "#fff",
      color: darkMode ? "#f1f1f1" : "#222",
      customClass: {
        popup: "achievement-modal-popup",
        confirmButton: "swal-achievements-btn"
      },
      confirmButtonText: "Close",
      showCloseButton: true,
      scrollbarPadding: false,
    });
  };

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
          <h2>Unlocked Achievements</h2>
          <div className="achievements-grid">
            {achievements.slice(0, 3).map((ach, index) => (
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
          {achievements.length > 3 && (
            <button
              className="view-all-btn"
              onClick={handleViewAllAchievements}
            >
              View All Achievements
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Profile;
