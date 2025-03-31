// src/contexts/ThemeContext.js
import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Cargar el valor de darkMode desde localStorage o establecer en modo oscuro por defecto
  const storedTheme = localStorage.getItem('darkMode');
  const [darkMode, setDarkMode] = useState(storedTheme ? JSON.parse(storedTheme) : true); // true significa modo oscuro por defecto

  useEffect(() => {
    // Cambiar la clase en el body cuando el tema cambia
    document.body.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('light-mode', !darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode)); // Guardar el nuevo estado en localStorage
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
