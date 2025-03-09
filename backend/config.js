// config.js
require('dotenv').config(); // Carga el archivo .env

const { Sequelize } = require('sequelize');

// Usar las variables de entorno para la conexión
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos
  process.env.DB_USER, // Usuario de la base de datos
  process.env.DB_PASSWORD, // Contraseña de la base de datos
  {
    host: process.env.DB_HOST, // Host de la base de datos
    dialect: process.env.DB_DIALECT, // Tipo de base de datos (mysql, postgres, etc.)
  }
);

module.exports = sequelize;

console.log(process.env.DB_HOST);
