import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Swal from "sweetalert2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]).{8,}$/;

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const togglePassword = () => setShowPassword(!showPassword);

  const validateForm = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo."
      );
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post("/api/login", { email, password });
      const { token } = response.data;

      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      console.log("🔐 Token decodificado:", decoded);
      console.log("📦 Token que se enviará a /user-profile:", token);

      const perfil = await axios.get("http://localhost:5000/api/user-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { nombre, email: correo } = perfil.data;

      localStorage.setItem("nombreUsuario", nombre);
      localStorage.setItem("emailUsuario", correo);

      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/landing");
    } catch (error) {
      console.error("🔥 Error al iniciar sesión o cargar perfil:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Correo, contraseña o usuario inválido.",
      });

      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={validateForm} autoComplete="off">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Ingresa tu correo"
                autoComplete="off"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="input-group password-group">
              <label>Contraseña</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="off"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <span className="password-toggle" onClick={togglePassword}>
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="login-btn" disabled={loading}>
              {loading ? "Cargando..." : "Acceder"}
            </button>
            <a href="/register" className="register-link">
              ¿No tienes cuenta? Regístrate
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
