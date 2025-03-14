import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Start from './pages/StartPage'
import Landing from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/SettingsPage';
import './index.css';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/settings" element={<Settings/>} />
      </Routes>
    </div>
  );
};

export default App;
