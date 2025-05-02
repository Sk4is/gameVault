import React from "react";
import "./AchievementIcon.css"; // Importamos el CSS externo

const iconMap = {
  1: "📝", // First Comment - Reseña
  2: "💡", // Brilliant Critic
  3: "🎁", // Collector
  4: "🧭", // Active Explorer
  5: "🌱", // Personal Renewal
  6: "🧠", // Expert Critic
};

const AchievementIcon = ({ id, alt = "Achievement Icon", className = "" }) => {
  const icon = iconMap[id] || "⭐";
  return (
    <span
      className={`achievement-icon ${className}`}
      role="img"
      aria-label={alt}
    >
      {icon}
    </span>
  );
};

export default AchievementIcon;
