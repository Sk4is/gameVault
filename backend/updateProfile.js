const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');  // Importamos la configuración de la base de datos

// Ruta para actualizar los datos del perfil
router.put('/update-profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];  // Obtenemos el token de los headers

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verificamos el token
    const userId = decoded.id;

    const { nombre, email, foto_perfil } = req.body;

    // Actualizamos el perfil en la base de datos
    const [result] = await db.execute(
      'UPDATE users SET nombre = ?, email = ?, foto_perfil = ? WHERE id = ?',
      [nombre, email, foto_perfil, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    res.status(200).json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
