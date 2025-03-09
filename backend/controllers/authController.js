import bcrypt from 'bcrypt';
import Usuario from '../models/user.js'; // Asegúrate de que la importación esté bien

// Controlador para registrar un nuevo usuario
export const registerUser = async (req, res) => {
    try {
      const { nombre, email, password, avatar, rol } = req.body;
      
      console.log('Datos recibidos:', req.body);  // Agrega un log para ver los datos que llegan
  
      // Verifica si el usuario ya existe
      const existingUser = await Usuario.findOne({ where: { email } });
      if (existingUser) {
        console.log('Usuario ya existe');
        return res.status(400).json({ message: 'El usuario con este correo ya existe' });
      }
  
      console.log('Creando nuevo usuario...');
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear el nuevo usuario en la base de datos
      const newUser = await Usuario.create({
        nombre,
        email,
        password: hashedPassword,
        avatar: avatar || null,  // Si no hay avatar, se guarda como null
        rol: rol || 'usuario',   // Si no se proporciona un rol, se asigna 'usuario' por defecto
      });
  
      console.log('Nuevo usuario creado:', newUser);  // Log para verificar la creación
      return res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
      console.error('Error al registrar el usuario:', error);  // Mejor manejo de errores
      return res.status(500).json({ message: 'Error al registrar el usuario', error: error.message || error });
    }
  };
  
  
  
