import express from 'express';
import { registerUser } from '../controllers/authController.js'; // Asegúrate de que el controlador esté importado correctamente
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

export default router;
