import React, { useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuVisible(false);
      setTimeout(() => {
        setIsMenuOpen(!isMenuOpen);
      }, 300);
    } else {
      setIsMenuOpen(!isMenuOpen);
      setIsMenuVisible(true);
    }
  };

  const navigate = useNavigate();

  const handleLandingRedirect = () => {
    navigate("/landing");
  };

  const handleLibraryRedirect = () => {
    navigate("/library");
  };

  const handleProfileRedirect = () => {
    navigate("/profile");
  };

  const handleSettingsRedirect = () => {
    navigate("/settings");
  };

  return (
    <header className="header">
      <div className="logo">
        <a onClick={handleLandingRedirect}>
          <img
            src="https://res.cloudinary.com/dimlqpphf/image/upload/v1741897097/Screenshot_4-removebg-preview_miskhy.png"
            alt="Logo"
            className="logo-img"
          />
        </a>
      </div>

      <div className="lettering">
        <img
          src="https://res.cloudinary.com/dimlqpphf/image/upload/v1741300424/GameVault1_flwfca.png"
          alt="GameVault lettering"
        />
      </div>

      <button onClick={toggleMenu} className="menu-btn" aria-label="Open menu">
        <Menu size={28} />
      </button>

      {isMenuOpen && (
        <nav className={`menu ${!isMenuVisible ? "hidden" : ""}`}>
          <ul className="menu-list">
            <li className="menu-item">
              <a onClick={handleLandingRedirect}>Home</a>
            </li>
            <li className="menu-item">
              <a onClick={handleLibraryRedirect}>Library</a>
            </li>
            <li className="menu-item">
              <a onClick={handleProfileRedirect}>Profile</a>
            </li>
            <button onClick={handleSettingsRedirect} className="settings-icon">
              <img
                src="https://res.cloudinary.com/dimlqpphf/image/upload/v1743416847/image_8_kbjqbo.png"
                alt="Settings"
              />
            </button>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
