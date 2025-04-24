import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]).{8,}$/;

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const validateForm = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrorMessage("Password must be at least 8 characters, include a capital letter, a number and a symbol.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await axios.post('/api/register', {
        name,
        email,
        password,
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User registered successfully.",
        confirmButtonText: "OK",
        confirmButtonColor: "#35b977",
        background: "#1a1a1a",
        color: "#fff",
        iconColor: "#35b977",
      }).then(() => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);

        navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "User registration failed.",
        confirmButtonText: "OK",
        confirmButtonColor: "#e74c3c",
        background: "#1a1a1a",
        color: "#fff",
        iconColor: "#e74c3c",
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h2>Sign Up</h2>
          <form onSubmit={validateForm}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={name}
                onChange={handleNameChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="input-group password-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <span className="password-toggle" onClick={togglePassword}>
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>
            <div className="input-group password-group">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
                <span className="repeat-password-toggle" onClick={toggleConfirmPassword}>
                  {showConfirmPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="login-btn">Register</button>
            <a href="/login" className="register-link">
              Already have an account? Log in
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
