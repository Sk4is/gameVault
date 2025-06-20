import React, { useState } from "react";
import "./HeaderSearch.css";
import { useNavigate } from "react-router-dom";
import { Search, Menu } from "lucide-react";
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
        `${import.meta.env.VITE_API_URL}/api/search-games`,
        { search: value }
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
    const trimmedSearch = search.trim();

    if (trimmedSearch.length === 0) return;

    if (searchResults.length > 0) {
      const firstMatch = searchResults[0];
      setSearch("");
      setSearchResults([]);
      navigate(`/gameinfo/${firstMatch.id}`);
    } else {
      console.log("🔍 No results found — no navigation triggered.");
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <a onClick={handleLandingRedirect}>
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
        <button type="submit" className="search-button" aria-label="Search">
          <Search size={18} />
        </button>
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
