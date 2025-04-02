const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');  // Importamos la configuración de la base de datos

// Ruta para obtener los datos del perfil
router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];  // Obtenemos el token de los headers

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verificamos el token
    const userId = decoded.id;

    // Consultamos el usuario en la base de datos
    const [userRows] = await db.execute('SELECT nombre, email, foto_perfil FROM users WHERE id = ?', [userId]);

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRows[0];  // El primer (y único) usuario de la consulta
    res.status(200).json({
      nombre: user.nombre,
      email: user.email,
      foto_perfil: user.foto_perfil,
    });
  } catch (error) {
    console.error("Error al obtener los datos del perfil:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
