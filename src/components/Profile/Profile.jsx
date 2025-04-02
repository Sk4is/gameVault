import React from "react";
import "./Profile.css";

const Profile = () => {
    return (
        <>
        <div className="profile-container">
          <div className="profile-img">
            <img
              alt="Foto de perfil"
            />
          </div>
          <div className="profile-info">
            <h1>Nombre del Usuario</h1>
          </div>
        </div>
        <hr className="separator"></hr>
        </>
  );
};

export default Profile;
