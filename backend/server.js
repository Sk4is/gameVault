// Cambiar importación de 'import express from 'express';' a 'require'
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Si esta es una ruta de archivo que usas, ya es require
const db = require('./config/db'); // Igual para este

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.listen(5000, () => console.log("Servidor corriendo en http://localhost:5000"));
