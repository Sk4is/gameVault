import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
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
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long, with a capital letter, a number, and a symbol."
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
      console.log("🔐 Decoded token:", decoded);
      console.log("📦 Token sent to /user-profile:", token);

      const profile = await axios.get(`${import.meta.env.VITE_API_URL}/api/user-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { name, email: userEmail } = profile.data;

      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", userEmail);

      navigate("/landing");
    } catch (error) {
      console.error("🔥 Error logging in or fetching profile:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid email, password, or user.",
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
          <h2>Login</h2>
          <form onSubmit={validateForm} autoComplete="off">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="off"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="input-group password-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
              {loading ? "Loading..." : "Login"}
            </button>
            <a href="/register" className="register-link">
              Don't have an account? Sign up
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
