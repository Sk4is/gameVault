const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con la base de datos:", err);
    process.exit(1);
  }
  console.log("✅ Conexión exitosa a la base de datos");
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error al verificar usuario" });

      if (result.length > 0)
        return res.status(400).json({ message: "El usuario ya existe" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      db.query(
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Error al registrar usuario" });

          res.status(201).json({ message: "Usuario registrado correctamente" });
        }
      );
    }
  );
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error al verificar usuario" });

      if (result.length === 0)
        return res.status(400).json({ message: "Usuario no encontrado" });

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(400).json({ message: "Contraseña incorrecta" });

      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Inicio de sesión exitoso",
        token,
        name: user.nombre,
      });
    }
  );
});

app.get("/api/user-profile", (req, res) => {
  const authHeader = req.headers.authorization;
  console.log("📥 Header recibido:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("❌ Encabezado de autorización inválido:", authHeader);
    return res.status(401).json({ message: "Token no válido o ausente" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔐 Token recibido:", token);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ Error al verificar token:", err);
      return res.status(401).json({ message: "Token inválido" });
    }

    const userId = decoded.id;
    console.log("🧠 ID decodificado:", userId);

    if (!userId) {
      console.error("❌ ID no encontrado en token");
      return res.status(400).json({ message: "Token sin ID válido" });
    }

    const query = "SELECT nombre, email, avatar FROM usuarios WHERE id = ?";
    console.log("📄 Ejecutando query:", query, "con id:", userId);

    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error("❌ Error SQL:", err);
        return res.status(500).json({ message: "Error de base de datos" });
      }

      if (result.length === 0) {
        console.warn("⚠️ Usuario no encontrado en la base de datos");
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      console.log("✅ Datos de usuario recuperados:", result[0]);
      res.status(200).json(result[0]);
    });
  });
});

app.put("/api/update-profile", (req, res) => {
  const { name, email, avatar } = req.body;

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "No se ha proporcionado un token de autenticación" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ Token inválido:", err);
      return res.status(401).json({ message: "Token no válido" });
    }

    const userId = decoded.id;

    const query =
      "UPDATE usuarios SET nombre = ?, email = ?, avatar = ? WHERE id = ?";
    db.query(query, [name, email, avatar, userId], (err) => {
      if (err) {
        console.error("❌ Error al actualizar el perfil:", err);
        return res
          .status(500)
          .json({ message: "Error al actualizar los datos del perfil." });
      }

      res.status(200).json({ message: "Perfil actualizado correctamente" });
    });
  });
});

app.post("/api/add-to-library", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { gameId, name, description, genre, platform, image, releaseDate } =
    req.body;

  if (!token)
    return res.status(401).json({ message: "Token no proporcionado" });
  if (!gameId || !name)
    return res.status(400).json({ message: "Datos del juego incompletos" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });

    const userId = decoded.id;

    const checkGameQuery = "SELECT id FROM juegos WHERE id = ?";
    db.query(checkGameQuery, [gameId], (err, gameRes) => {
      if (err)
        return res.status(500).json({ message: "Error al verificar juego" });

      const insertGameIfNeeded = (callback) => {
        if (gameRes.length === 0) {
          const insertGameQuery = `
            INSERT INTO juegos (id, nombre, descripcion, genero, plataforma, imagen, fecha_lanzamiento)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          db.query(
            insertGameQuery,
            [
              gameId,
              name,
              description || null,
              genre || null,
              platform || null,
              image || null,
              releaseDate || null,
            ],
            (err) => {
              if (err) {
                console.error("❌ Error al insertar juego:", err);
                return res
                  .status(500)
                  .json({ message: "Error al insertar juego" });
              }
              callback();
            }
          );
        } else {
          callback();
        }
      };

      insertGameIfNeeded(() => {
        const checkLibraryQuery =
          "SELECT * FROM biblioteca_usuario WHERE usuario_id = ? AND juego_id = ?";
        db.query(checkLibraryQuery, [userId, gameId], (err, libRes) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Error al verificar biblioteca" });
          if (libRes.length > 0)
            return res
              .status(400)
              .json({ message: "Juego ya en la biblioteca" });

          const insertLibQuery = `
            INSERT INTO biblioteca_usuario (usuario_id, juego_id)
            VALUES (?, ?)
          `;
          db.query(insertLibQuery, [userId, gameId], (err) => {
            if (err) {
              console.error("❌ Error al insertar en biblioteca:", err);
              return res
                .status(500)
                .json({ message: "Error al añadir a la biblioteca" });
            }

            res
              .status(201)
              .json({ message: "Juego añadido correctamente a la biblioteca" });
          });
        });
      });
    });
  });
});

app.get("/api/user-library", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const userId = decoded.id;

    const query = `
      SELECT j.id, j.nombre AS title, j.imagen AS image,
             b.ultima_conexion, b.horas_jugadas
      FROM biblioteca_usuario b
      JOIN juegos j ON j.id = b.juego_id
      WHERE b.usuario_id = ?
      ORDER BY b.ultima_conexion DESC
    `;

    db.query(query, [userId], (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error de base de datos" });
      res.status(200).json(result);
    });
  });
});

app.post("/api/update-playtime", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { gameId, duration } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });

    const userId = decoded.id;

    const updateQuery = `
      UPDATE biblioteca_usuario
      SET horas_jugadas = horas_jugadas + ?, ultima_conexion = NOW()
      WHERE usuario_id = ? AND juego_id = ?
    `;

    db.query(updateQuery, [duration, userId, gameId], (err) => {
      if (err)
        return res.status(500).json({ message: "Error al actualizar horas" });
      res.status(200).json({ message: "Horas actualizadas correctamente" });
    });
  });
});

app.delete("/api/remove-from-library/:gameId", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { gameId } = req.params;

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const userId = decoded.id;

    const deleteQuery = `
      DELETE FROM biblioteca_usuario
      WHERE usuario_id = ? AND juego_id = ?
    `;

    db.query(deleteQuery, [userId, gameId], (err, result) => {
      if (err) {
        console.error("❌ Error al eliminar juego:", err);
        return res
          .status(500)
          .json({ message: "Error al eliminar el juego de la biblioteca" });
      }

      res.status(200).json({ message: "Juego eliminado de la biblioteca" });
    });
  });
});

app.post("/api/reviews", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { game_id, game_name, content, rating } = req.body;

  if (!token) return res.status(401).json({ message: "Token requerido" });
  if (!game_id || !game_name || !content || !rating)
    return res
      .status(400)
      .json({ message: "Datos incompletos para la reseña" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token inválido" });

    const userId = decoded.id;

    const checkGameQuery = "SELECT id FROM juegos WHERE id = ?";
    db.query(checkGameQuery, [game_id], (err, gameRes) => {
      if (err)
        return res.status(500).json({ message: "Error al verificar juego" });

      const insertGameIfNeeded = (callback) => {
        if (gameRes.length === 0) {
          const insertGameQuery = `
            INSERT INTO juegos (id, nombre)
            VALUES (?, ?)
          `;
          db.query(insertGameQuery, [game_id, game_name], (err) => {
            if (err) {
              console.error("❌ Error al insertar juego:", err);
              return res
                .status(500)
                .json({ message: "Error al insertar juego" });
            }
            callback();
          });
        } else {
          callback();
        }
      };

      insertGameIfNeeded(() => {
        const checkReviewQuery = `
          SELECT id FROM reseñas WHERE usuario_id = ? AND juego_id = ?
        `;
        db.query(checkReviewQuery, [userId, game_id], (err, reviewRes) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Error al verificar reseña previa" });

          if (reviewRes.length > 0) {
            return res
              .status(400)
              .json({ message: "Ya has dejado una reseña para este juego" });
          }

          const insertReviewQuery = `
            INSERT INTO reseñas (usuario_id, juego_id, calificacion, comentario)
            VALUES (?, ?, ?, ?)
          `;
          db.query(
            insertReviewQuery,
            [userId, game_id, rating, content],
            (err) => {
              if (err) {
                console.error("❌ Error al guardar reseña:", err);
                return res
                  .status(500)
                  .json({ message: "Error al guardar reseña" });
              }

              db.query(
                "SELECT nombre FROM usuarios WHERE id = ?",
                [userId],
                (err, userRes) => {
                  if (err)
                    return res
                      .status(500)
                      .json({ message: "Error al obtener usuario" });

                  const username = userRes[0]?.nombre || "Usuario";

                  res.status(201).json({
                    username,
                    content,
                    rating,
                    fecha_publicacion: new Date(),
                  });
                }
              );
            }
          );
        });
      });
    });
  });
});

app.delete("/api/reviews/:gameId/:userId", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { gameId, userId: targetUserId } = req.params;

  if (!token) return res.status(401).json({ message: "Token requerido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token inválido" });

    const requesterId = decoded.id;
    const requesterRole = decoded.rol;

    if (requesterRole !== "admin" && requesterId !== parseInt(targetUserId)) {
      return res.status(403).json({ message: "No autorizado para eliminar esta reseña" });
    }

    const deleteQuery = `
      DELETE FROM reseñas WHERE usuario_id = ? AND juego_id = ?
    `;

    db.query(deleteQuery, [targetUserId, gameId], (err, result) => {
      if (err) {
        console.error("❌ Error eliminando reseña:", err);
        return res.status(500).json({ message: "Error al eliminar reseña" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Reseña no encontrada" });
      }

      res.status(200).json({ message: "Reseña eliminada correctamente" });
    });
  });
});

app.get("/api/reviews/:gameId", (req, res) => {
  const gameId = req.params.gameId;

  const query = `
  SELECT r.usuario_id, r.calificacion AS rating, r.comentario AS content, r.fecha_publicacion,
         u.nombre AS username
  FROM reseñas r
  JOIN usuarios u ON u.id = r.usuario_id
  WHERE r.juego_id = ?
  ORDER BY r.fecha_publicacion DESC
`;

  db.query(query, [gameId], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener reseñas:", err);
      return res.status(500).json({ message: "Error de base de datos" });
    }

    res.status(200).json(results);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${process.env.PORT}`);
});
