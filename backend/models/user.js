import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Asegúrate de tener la instancia de sequelize configurada

const Usuario = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true, // Puede ser NULL
  },
  fecha_registro: {
    type: DataTypes.TIMESTAMP,
    defaultValue: DataTypes.NOW, // Establece la fecha de registro como la fecha actual
  },
  rol: {
    type: DataTypes.ENUM('usuario', 'admin'),
    defaultValue: 'usuario', // Valor por defecto
  },
});

export default Usuario;
