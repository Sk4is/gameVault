import React from "react";
import "./Start.css";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const navigate = useNavigate();

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="container">
        <div className="logoStart">
          <img
            src="https://res.cloudinary.com/dimlqpphf/image/upload/v1741300424/GameVault1_flwfca.png"
            alt="GameVault Logo"
          />
        </div>
        <div className="options">
          <div className="title">
            <h1>Tu biblioteca</h1>
            <h1>Tu mundo</h1>
            <h1>Tu juego.</h1>
          </div>
          <p>Únete ya.</p>
          <button className="register" onClick={handleRegisterRedirect}>
            Registrate
          </button>
          <div class="divider">
            <span>O</span>
          </div>
          <button className="login" onClick={handleLoginRedirect}>
            Inicia Sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default Start;
