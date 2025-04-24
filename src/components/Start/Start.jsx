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
            <h1>Your Library</h1>
            <h1>Your World</h1>
            <h1>Your Game.</h1>
          </div>
          <p>Join now.</p>
          <button className="register" onClick={handleRegisterRedirect}>
            Sign Up
          </button>
          <div className="divider">
            <span>OR</span>
          </div>
          <button className="login" onClick={handleLoginRedirect}>
            Log In
          </button>
        </div>
      </div>
    </>
  );
};

export default Start;
