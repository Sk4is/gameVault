import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/LandingPage';
import Login from './pages/Login';
import './index.css';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} /> 
      </Routes>
    </div>
  );
};

export default App;
