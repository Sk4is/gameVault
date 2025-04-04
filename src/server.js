const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

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

app.post('/api/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al verificar usuario' });
    if (result.length > 0) return res.status(400).json({ message: 'El usuario ya existe' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al registrar usuario' });
      res.status(201).json({ message: 'Usuario registrado correctamente' });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al verificar usuario' });
    if (result.length === 0) return res.status(400).json({ message: 'Usuario no encontrado' });

    const usuario = result[0];

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      nombre: usuario.nombre,
    });
  });
}); 

app.get('/api/user-profile', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No se ha proporcionado un token de autenticación' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token no válido' });
    }

    const userId = decoded.id;
    db.query('SELECT id, nombre, email, foto_perfil FROM usuarios WHERE id = ?', [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al obtener los datos del usuario' });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(result[0]);
    });
  });
});

app.put('/api/update-profile', (req, res) => {
  const { id, nombre, email, foto_perfil } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ message: 'Nombre y email son requeridos.' });
  }

  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No se ha proporcionado un token de autenticación' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token no válido' });
    }

    if (decoded.id !== id) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar este perfil' });
    }

    let query = 'UPDATE usuarios SET nombre = ?, email = ?, foto_perfil = ? WHERE id = ?';

    db.query(query, [nombre, email, foto_perfil, id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al actualizar los datos del perfil.' });
      }
      res.status(200).json({ message: 'Perfil actualizado correctamente' });
    });
  });
});

// Iniciar el servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
