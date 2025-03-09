import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import sequelize from './config/db.js';  // Importa la configuración de Sequelize

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api', authRoutes); // Asegúrate de que tus rutas estén bien configuradas

// Conexión a la base de datos MySQL con Sequelize
sequelize.authenticate()
  .then(() => {
    console.log('Conectado a la base de datos MySQL');
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

// Sincronización de las tablas con la base de datos
sequelize.sync()
  .then(() => {
    console.log('Tablas sincronizadas con la base de datos');
  })
  .catch((err) => {
    console.error('Error al sincronizar las tablas:', err);
  });

// Puerto del servidor backend
const port = 5000;
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
