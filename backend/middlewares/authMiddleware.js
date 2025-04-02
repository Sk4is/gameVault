import jwt from "jsonwebtoken";

module.exports = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ error: "Acceso denegado, no se encontró el token" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Token inválido o expirado" });
      }
      req.user = decoded;
      next();
    });
  };  
