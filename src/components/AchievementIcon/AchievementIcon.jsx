import React from "react";
import "./AchievementIcon.css";

const iconMap = {
  1: "📝",
  2: "💡",
  3: "🎁",
  4: "🧭",
  5: "🌱",
  6: "🧠",
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
