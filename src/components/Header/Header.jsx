import React, { useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

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
        <a href="/landing">
          <img
            src="https://res.cloudinary.com/dimlqpphf/image/upload/v1741288545/GameVault_ltzotm.png"
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

      <button onClick={toggleMenu} className="menu-btn">
        Menú
      </button>

      {isMenuOpen && (
        <nav className={`menu ${!isMenuVisible ? "hidden" : ""}`}>
          <ul className="menu-list">
            <li className="menu-item">
              <a onClick={handleLandingRedirect}>Inicio</a>
            </li>
            <li className="menu-item">
              <a onClick={handleLibraryRedirect}>Biblioteca</a>
            </li>
            <li className="menu-item">
              <a onClick={handleProfileRedirect}>Perfil</a>
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
