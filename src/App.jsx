// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Start from './pages/StartPage';
import Landing from './pages/LandingPage';
import Info from './pages/GameInfoPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/SettingsPage';
import { ThemeProvider } from './components/Contexts/ThemeContext'; // Importamos el ThemeProvider
import './index.css';

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/gameinfo/:id" element={<Info />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
