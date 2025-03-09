import { Sequelize } from 'sequelize';

// Configura tu base de datos MySQL aquí
const sequelize = new Sequelize('game_vault', 'usuario', 'contraseña', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,  // Puedes habilitar el logging para ver las consultas SQL
});

export default sequelize;
