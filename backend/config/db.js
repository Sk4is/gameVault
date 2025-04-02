const mysql = require('mysql2');

// Crea la conexión a la base de datos MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',  // Cambia estos valores según tu configuración
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nombre_de_tu_base_de_datos'
});

// Promise para facilitar el manejo de consultas asincrónicas
const promisePool = pool.promise();

module.exports = promisePool;
