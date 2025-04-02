// Cambiar todas las importaciones de ES module por 'require'
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { nombre, email, password } = req.body;

  console.log("Datos recibidos:", { nombre, email, password });

  getUserByEmail(email, async (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ error: "Error en la consulta a la base de datos" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      createUser(nombre, email, hashedPassword, (err) => {
        if (err) {
          console.error("Error al insertar usuario:", err);
          return res.status(500).json({ error: "Error al registrar usuario en la base de datos" });
        }

        console.log("Usuario registrado con éxito");
        res.status(201).json({ message: "Usuario creado con éxito" });
      });
    } catch (err) {
      console.error("Error al encriptar la contraseña", err);
      return res.status(500).json({ error: "Error al encriptar la contraseña" });
    }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
};

exports.getProfile = async (req, res) => {
  const sql = "SELECT id, name, email FROM users WHERE id = ?";
  db.query(sql, [req.user.userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener perfil" });
    res.json({ user: results[0] });
  });
};
