import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Usuario = sequelize.define("users", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false }
}, {
    timestamps: false
});

sequelize.sync()
  .then(() => console.log("Modelo de usuarios sincronizado con la base de datos"))
  .catch(err => console.error("Error sincronizando el modelo:", err));

module.exports = Usuario;
