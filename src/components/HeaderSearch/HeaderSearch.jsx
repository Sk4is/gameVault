import React, { useState } from "react";
import "./HeaderSearch.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.post(
        "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games",
        `search "${value}"; fields id, name; limit 10;`,
        {
          headers: {
            "Client-ID": "yytjvifii8si3zmeshx8znlox2nuc5",
            Authorization: "Bearer vb8e7cupalh6uc0pafce3eikvd9pfs",
          },
        }
      );

      setSearchResults(response.data);
    } catch (error) {
      console.error("❌ Error searching games:", error);
    }
  };

  const handleGameSelect = (gameId) => {
    setSearch("");
    setSearchResults([]);
    navigate(`/gameinfo/${gameId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setSearchResults([]);
    }
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

      <form onSubmit={handleSearchSubmit} className="search-bar-container">
        <input
          type="text"
          placeholder="Search games..."
          className="search-input"
          value={search}
          onChange={handleSearchChange}
        />
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((game) => (
              <li
                key={game.id}
                className="search-result-item"
                onClick={() => handleGameSelect(game.id)}
              >
                {game.name}
              </li>
            ))}
          </ul>
        )}
      </form>

      <button onClick={toggleMenu} className="menu-btn">
        Menu
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
