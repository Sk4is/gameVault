import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    // Recuperamos el nombre del usuario desde localStorage
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) {
      setNombre(nombreGuardado);
    }
  }, []);

  return (
    <>
      <div className="profile-container">
        <div className="profile-img">
          <img
            src="https://via.placeholder.com/150" // Aquí puedes colocar la imagen de perfil real
            alt="Foto de perfil"
          />
        </div>
        <div className="profile-info">
          <h1>{nombre || 'Usuario'}</h1> {/* Si no hay nombre, muestra 'Usuario' */}
        </div>
      </div>
      <hr className="separator"></hr>
    </>
  );
};

export default Profile;
