import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

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

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleSettingsRedirect = () => {
    navigate('/settings');
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

      <div className='lettering'>
        <img src="https://res.cloudinary.com/dimlqpphf/image/upload/v1741300424/GameVault1_flwfca.png" alt="GameVault lettering" />
      </div>

      <button onClick={toggleMenu} className="menu-btn">
        Menú
      </button>

      {isMenuOpen && (
        <nav className={`menu ${!isMenuVisible ? 'hidden' : ''}`}>
          <ul className="menu-list">
            <li className="menu-item"><a onClick={handleLoginRedirect}>Ver Perfil</a></li>
            <li className="menu-item"><a href="/buscar">Buscar</a></li>
            <li className="menu-item"><a onClick={handleSettingsRedirect}>Ajustes</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
