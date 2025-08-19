const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://game-vault-omega.vercel.app"],
    credentials: true,
  })
);

let dbConfig;

if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
  const dbUrl = new URL(process.env.DATABASE_URL);
  dbConfig = {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace("/", ""),
    port: dbUrl.port || 3306,
    ssl: { rejectUnauthorized: false },
    charset: "utf8mb4"
  };
} else {
  dbConfig = {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "game_vault",
    port: process.env.DB_PORT || 3306,
    charset: "utf8mb4"
  };
}

const db = mysql.createConnection(dbConfig);


db.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to the database:", err);
    process.exit(1);
  }
  console.log("✅ Successfully connected to the database");
});

function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

app.get("/api/user-reviews", authenticateUser, (req, res) => {
  const userId = req.user.id;

  const query = "SELECT * FROM reviews WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error getting user reviews:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
});

app.get("/api/popular-games", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      `fields name, first_release_date, cover.url, rating, genres.name, summary, platforms.abbreviation; sort rating desc; limit 100;`,
      {
        headers: {
          "Client-ID": process.env.CLIENT_ID,
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
  console.error("❌ IGDB fetch error:");
  if (error.response) {
    console.error("Status:", error.response.status);
    console.error("Data:", error.response.data);
    console.error("Headers:", error.response.headers);
  } else if (error.request) {
    console.error("No response received:", error.request);
  } else {
    console.error("Error message:", error.message);
  }

  res.status(500).json({ message: "Failed to fetch IGDB games" });
}
});

app.get("/api/classic-games", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      `fields name, first_release_date, cover.url, rating, genres.name, summary, platforms.abbreviation;
       where first_release_date >= 315532800 & first_release_date < 1325376000 & rating >= 85;  
       sort rating desc;
       limit 500;`,
      {
        headers: {
          "Client-ID": process.env.CLIENT_ID,
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ IGDB classic error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch classic games" });
  }
});

app.get("/api/new-games", async (req, res) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    twoYearsAgo.setMonth(0);
    twoYearsAgo.setDate(1);
    const twoYearsAgoTimestamp = Math.floor(twoYearsAgo.getTime() / 1000);

    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      `fields name, first_release_date, cover.url, rating, genres.name, summary, platforms.abbreviation;
       where first_release_date >= ${twoYearsAgoTimestamp} & first_release_date <= ${now}; 
       sort first_release_date desc;
       limit 500;`,
      {
        headers: {
          "Client-ID": process.env.CLIENT_ID,
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ IGDB new error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch new games" });
  }
});

app.get("/api/game-trailer", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      `fields name, first_release_date, cover.url, rating, genres.name, summary, platforms.abbreviation, videos.video_id;
       where first_release_date >= 315532800 & first_release_date < 1325376000 & rating >= 85;  
       sort rating desc;
       limit 500;`,
      {
        headers: {
          "Client-ID": process.env.CLIENT_ID,
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ IGDB trailer fetch error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch trailer games" });
  }
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Error checking user" });

      if (result.length > 0)
        return res.status(400).json({ message: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err) => {
          if (err)
            return res.status(500).json({ message: "Error registering user" });

          res.status(201).json({ message: "User registered successfully" });
        }
      );
    }
  );
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Error checking user" });

      if (result.length === 0)
        return res.status(400).json({ message: "User not found" });

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(400).json({ message: "Incorrect password" });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
        name: user.name,
      });
    }
  );
});

app.post("/api/search-games", (req, res) => {
  const search = req.body.search;

  axios
    .post(
      "https://api.igdb.com/v4/games",
      `search "${search}"; fields id, name; limit 10;`,
      {
        headers: {
          "Client-ID": process.env.CLIENT_ID,
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "text/plain",
        },
      }
    )
    .then((response) => res.json(response.data))
    .catch((error) => {
      console.error("IGDB search error:", error.response?.data || error.message);
      res.status(500).json({ error: "Search failed" });
    });
});

app.get("/api/user-profile", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("❌ Invalid authorization header:", authHeader);
    return res.status(401).json({ message: "Invalid or missing token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ Error al verificar token:", err);
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.id;

    if (!userId) {
      console.error("❌ ID not found in token");
      return res.status(400).json({ message: "Token without valid ID" });
    }

    const query = "SELECT name, email, avatar FROM users WHERE id = ?";

    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error("❌ SQL error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
        console.warn("⚠️ User not found in the data base");
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(result[0]);
    });
  });
});

app.put("/api/update-profile", (req, res) => {
  const { name, email, avatar } = req.body;

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ Invalid token:", err);
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.id;

    const query =
      "UPDATE users SET name = ?, email = ?, avatar = ? WHERE id = ?";
    db.query(query, [name, email, avatar, userId], (err) => {
      if (err) {
        console.error("❌ Error updating profile:", err);
        return res.status(500).json({ message: "Error updating profile." });
      }

      res.status(200).json({ message: "Profile updated" });
    });
  });
});

app.post("/api/add-to-library", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { gameId, name, description, genre, platform, image, releaseDate } =
    req.body;

  if (!token) return res.status(401).json({ message: "Token not provided" });
  if (!gameId || !name)
    return res.status(400).json({ message: "Incomplete game data" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    const userId = decoded.id;

    const checkGameQuery = "SELECT id FROM games WHERE id = ?";
    db.query(checkGameQuery, [gameId], (err, gameRes) => {
      if (err) return res.status(500).json({ message: "Error checking game" });

      const insertGameIfNeeded = (callback) => {
        if (gameRes.length === 0) {
          const insertGameQuery = `
            INSERT INTO games (id, name, description, genre, platform, image, release_date)
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
                console.error("❌ Error inserting game:", err);
                return res
                  .status(500)
                  .json({ message: "Error inserting game" });
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
          "SELECT * FROM user_library WHERE user_id = ? AND game_id = ?";
        db.query(checkLibraryQuery, [userId, gameId], (err, libRes) => {
          if (err)
            return res.status(500).json({ message: "Error checking library" });
          if (libRes.length > 0)
            return res.status(400).json({ message: "Game already in library" });

          const insertLibQuery = `
            INSERT INTO user_library (user_id, game_id)
            VALUES (?, ?)
          `;
          db.query(insertLibQuery, [userId, gameId], (err) => {
            if (err) {
              console.error("❌ Error inserting into library:", err);
              return res
                .status(500)
                .json({ message: "Error adding to library" });
            }

            res
              .status(201)
              .json({ message: "Game successfully added to library" });
          });
        });
      });
    });
  });
});

app.get("/api/user-library", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.id;

    const query = `
      SELECT j.id, j.name AS title, j.image AS image,
             b.last_connection, b.hours_played
      FROM user_library b
      JOIN games j ON j.id = b.game_id
      WHERE b.user_id = ?
      ORDER BY b.last_connection DESC
    `;

    db.query(query, [userId], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(200).json(result);
    });
  });
});

app.post("/api/update-playtime", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { gameId, duration } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    const userId = decoded.id;

    const updateQuery = `
      UPDATE user_library
      SET hours_played = hours_played + ?, last_connection = NOW()
      WHERE user_id = ? AND game_id = ?
    `;

    db.query(updateQuery, [duration, userId, gameId], (err) => {
      if (err)
        return res.status(500).json({ message: "Error updating playtime" });
      res.status(200).json({ message: "Playtime successfully updated" });
    });
  });
});

app.delete("/api/remove-from-library/:gameId", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { gameId } = req.params;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.id;

    const deleteQuery = `
      DELETE FROM user_library
      WHERE user_id = ? AND game_id = ?
    `;

    db.query(deleteQuery, [userId, gameId], (err, result) => {
      if (err) {
        console.error("❌ Error removing game:", err);
        return res
          .status(500)
          .json({ message: "Error deleting game from library" });
      }

      res.status(200).json({ message: "Game removed from library" });
    });
  });
});

app.post("/api/reviews", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { game_id, game_name, content, rating } = req.body;

  if (!token) return res.status(401).json({ message: "Token required" });
  if (!game_id || !game_name || !content || rating == null)
    return res.status(400).json({ message: "Incomplete review data" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const userId = decoded.id;

    const checkGameQuery = "SELECT id FROM games WHERE id = ?";
    db.query(checkGameQuery, [game_id], (err, gameRes) => {
      if (err) return res.status(500).json({ message: "Error checking game" });

      const insertGameIfNeeded = (callback) => {
        if (gameRes.length === 0) {
          const insertGameQuery = `
            INSERT INTO games (id, name)
            VALUES (?, ?)
          `;
          db.query(insertGameQuery, [game_id, game_name], (err) => {
            if (err) {
              console.error("❌ Error inserting game:", err);
              return res.status(500).json({ message: "Error inserting game" });
            }
            callback();
          });
        } else {
          callback();
        }
      };

      insertGameIfNeeded(() => {
        const checkReviewQuery = `
          SELECT id FROM reviews WHERE user_id = ? AND game_id = ?
        `;
        db.query(checkReviewQuery, [userId, game_id], (err, reviewRes) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Error checking previous review" });

          if (reviewRes.length > 0) {
            return res
              .status(400)
              .json({ message: "You have already reviewed this game" });
          }

          const insertReviewQuery = `
            INSERT INTO reviews (user_id, game_id, rating, comment, published_date)
            VALUES (?, ?, ?, ?, NOW())
          `;
          db.query(
            insertReviewQuery,
            [userId, game_id, rating, content],
            (err) => {
              if (err) {
                console.error("❌ Error saving review:", err);
                return res.status(500).json({ message: "Error saving review" });
              }

              db.query(
                "SELECT name FROM users WHERE id = ?",
                [userId],
                (err, userRes) => {
                  if (err)
                    return res
                      .status(500)
                      .json({ message: "Error retrieving user" });

                  const username = userRes[0]?.name || "Usuario";

                  res.status(201).json({
                    username,
                    content,
                    rating,
                    published_date: new Date(),
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

  if (!token) return res.status(401).json({ message: "Token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const requesterId = decoded.id;
    const requesterRole = decoded.role;

    if (requesterRole !== "admin" && requesterId !== parseInt(targetUserId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    const deleteQuery = `
      DELETE FROM reviews WHERE user_id = ? AND game_id = ?
    `;

    db.query(deleteQuery, [targetUserId, gameId], (err, result) => {
      if (err) {
        console.error("❌ Error eliminando reseña:", err);
        return res.status(500).json({ message: "Error deleting review" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.status(200).json({ message: "Review successfully deleted" });
    });
  });
});

app.get("/api/game-details/:id", async (req, res) => {
  const gameId = req.params.id;

  try {
    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      `fields name, first_release_date, cover.url, rating, genres.name, summary, platforms.abbreviation, screenshots.url; where id = ${gameId};`,
      {
        headers: {
          "Client-ID": process.env.CLIENT_ID,
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    if (response.data.length === 0) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.json(response.data[0]);
  } catch (error) {
    console.error("❌ Error fetching game details:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch game details" });
  }
});

app.get("/api/game-name/:id", async (req, res) => {
  const gameId = req.params.id;

  try {
    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      `fields name; where id = ${gameId};`,
      {
        headers: {
          "Client-ID": process.env.CLIENT_ID,
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    if (response.data.length === 0) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.json(response.data[0]);
  } catch (error) {
    console.error("❌ Error fetching game name:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch game name" });
  }
});

app.get("/api/reviews/:gameId", (req, res) => {
  const gameId = req.params.gameId;

  const query = `
  SELECT r.user_id, r.rating AS rating, r.comment AS content, r.published_date,
         u.name AS username
  FROM reviews r
  JOIN users u ON u.id = r.user_id
  WHERE r.game_id = ?
  ORDER BY r.published_date DESC
`;

  db.query(query, [gameId], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener reviews:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  });
});

app.get("/api/user-achievements", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const userId = decoded.id;

    const query = `
      SELECT 
        a.id, 
        a.name, 
        a.description, 
        a.type, 
        a.points, 
        ua.unlocked_date
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = ?
      ORDER BY ua.unlocked_date DESC
    `;

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("❌ Error in achievements query:", err);
        return res.status(500).json({ message: "Error loading achievements" });
      }

      res.status(200).json(results);
    });
  });
});

app.post("/api/unlock-achievement", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { achievement_id } = req.body;

  if (!token) return res.status(401).json({ message: "Token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const userId = decoded.id;

    const checkQuery = `
      SELECT * FROM user_achievements
      WHERE user_id = ? AND achievement_id = ?
    `;
    db.query(checkQuery, [userId, achievement_id], (err, result) => {
      if (err) {
        console.error("❌ DB error:", err);
        return res.status(500).json({ message: "DB error" });
      }

      if (result.length > 0) {
        return res.status(200).json({ message: "Already unlocked" });
      }

      const insertQuery = `
        INSERT INTO user_achievements (user_id, achievement_id, type, unlocked_date)
        VALUES (?, ?, (SELECT type FROM achievements WHERE id = ?), NOW())
      `;
      db.query(insertQuery, [userId, achievement_id, achievement_id], (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            console.warn("⚠️ Duplicate achievement prevented by DB constraint.");
            return res.status(200).json({ message: "Already unlocked (DB constraint)" });
          }
          console.error("❌ Error inserting achievement:", err);
          return res.status(500).json({ message: "Error inserting achievement" });
        }

        res.status(201).json({ message: "Achievement unlocked" });
      });
    });
  });
});

module.exports = app;