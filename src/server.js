const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json()); // Para poder leer JSON en las peticiones
app.use(cors()); // Para habilitar CORS

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    process.exit(1);
  }
  console.log('Conexión exitosa a la base de datos');
});

// Rutas de autenticación
// Rutas de autenticación
// Registrar un usuario
app.post('/api/register', async (req, res) => {  // Cambiar '/register' a '/api/register'
    const { nombre, email, password } = req.body;
  
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
  
    // Comprobar si el usuario ya existe
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al verificar usuario' });
      if (result.length > 0) return res.status(400).json({ message: 'El usuario ya existe' });
  
      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Insertar el usuario en la base de datos
      db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error al registrar usuario' });
        res.status(201).json({ message: 'Usuario registrado correctamente' });
      });
    });
  });
  
  // Iniciar sesión
  app.post('/api/login', (req, res) => {  // Cambiar '/login' a '/api/login'
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
  
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al verificar usuario' });
      if (result.length === 0) return res.status(400).json({ message: 'Usuario no encontrado' });
  
      const usuario = result[0];
  
      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, usuario.password);
      if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });
  
      // Crear el token JWT
      const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ message: 'Inicio de sesión exitoso', token });
    });
  });  

  app.put('/api/update-profile', (req, res) => {
    const { id, nombre, email, foto_perfil } = req.body;
  
    if (!nombre || !email) {
      return res.status(400).json({ message: 'Nombre y email son requeridos.' });
    }
  
    let query = 'UPDATE usuarios SET nombre = ?, email = ?, foto_perfil = ? WHERE id = ?';
  
    db.query(query, [nombre, email, foto_perfil, id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al actualizar los datos del perfil.' });
      }
      res.status(200).json({ message: 'Perfil actualizado correctamente' });
    });
  });

// Iniciar el servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
