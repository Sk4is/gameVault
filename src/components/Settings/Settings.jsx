import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../Contexts/ThemeContext";
import "./Settings.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

const Settings = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("userEmail");
    const storedAvatar = localStorage.getItem("userAvatar");

    if (storedName) setUsername(storedName);
    if (storedEmail) setEmail(storedEmail);
    if (storedAvatar) setAvatar(storedAvatar);

    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const { name, email, avatar } = response.data;

          setUsername(name);
          setEmail(email);

          if (avatar && avatar.trim() !== "") {
            console.log("✅ Avatar loaded from the database");
            setAvatar(avatar);
            localStorage.setItem("userAvatar", avatar);
          } else {
            console.log("ℹ️ Avatar not found, using default");
            setAvatar(DEFAULT_AVATAR);
            localStorage.setItem("userAvatar", DEFAULT_AVATAR);
          }

          localStorage.setItem("username", name);
          localStorage.setItem("userEmail", email);
        })
        .catch((error) => {
          console.error("❌ Error fetching profile data:", error);
        });
    }
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("📸 Image loaded from input");
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.put(
        "http://localhost:5000/api/update-profile",
        {
          name: username,
          email,
          avatar: avatar || "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      Swal.fire({
        icon: "success",
        title: "Profile updated!",
        text: response.data.message,
        confirmButtonText: "OK",
      });
  
      localStorage.setItem("username", username);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userAvatar", avatar || DEFAULT_AVATAR);
  
      const { data: unlocked } = await axios.get("http://localhost:5000/api/user-achievements", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const alreadyUnlocked = unlocked.some((ach) => ach.id === 4);
      if (!alreadyUnlocked) {
        await axios.post(
          "http://localhost:5000/api/unlock-achievement",
          { achievement_id: 4 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        Swal.fire({
          icon: "success",
          title: "Achievement unlocked!",
          text: "You unlocked: Personal Renewal 🎯",
          timer: 3000,
          showConfirmButton: false,
        });
      }
  
    } catch (error) {
      console.error("❌ Error saving profile:", error);
  
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was a problem saving the changes.",
        confirmButtonText: "OK",
      });
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={`settings-container ${darkMode ? "dark" : "light"}`}>
      <h2 className="title">SETTINGS</h2>
      <div className="settings-content">
        <div className="left-panel">
          <label className="profile-label">PROFILE PICTURE</label>
          <div className="profile-pic-container">
            <div className="profile-pic">
              <img src={avatar} alt="User avatar" />
            </div>
            <button
              className="change-photo-button"
              onClick={() => document.getElementById("fileInput").click()}
            >
              Change profile picture
            </button>
          </div>
          <input
            id="fileInput"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />

          <label className="field-label">USERNAME</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />

          <label className="field-label">EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
            required
          />
        </div>

        <div className="separator-popular"></div>

        <div className="right-panel">
          <label className="mode-label">LIGHT / DARK MODE</label>
          <div className="toggle-container" onClick={toggleDarkMode}>
            <span className="sun">☀️</span>
            <div className={`toggle-switch ${darkMode ? "" : "active"}`}></div>
            <span className="moon">🌙</span>
          </div>
        </div>
      </div>
      <button className="save-button" onClick={handleSaveChanges}>
        Save Changes
      </button>

      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Settings;
