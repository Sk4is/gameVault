import React from 'react';
import './login.css';

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          <form>
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Ingresa tu correo" required />
            </div>
            <div className="input-group">
              <label>Contraseña</label>
              <input type="password" placeholder="Ingresa tu contraseña" required />
            </div>
            <button className="login-btn">Acceder</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
