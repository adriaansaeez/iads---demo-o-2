const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  changePassword
} = require('../controllers/authController');
const { verifyToken, optionalAuth } = require('../middleware/auth');

// Rate limiting para endpoints de autenticación (TEMPORALMENTE DESHABILITADO PARA PRUEBAS)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // aumentado temporalmente para pruebas
  message: {
    success: false,
    error: 'Demasiados intentos de autenticación. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // aumentado temporalmente para pruebas
  message: {
    success: false,
    error: 'Demasiados registros desde esta IP. Intenta de nuevo en 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rutas públicas
// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', /* registerLimiter, */ optionalAuth, register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', /* authLimiter, */ login);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', logout);

// Rutas protegidas
// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', verifyToken, getMe);

// PUT /api/auth/change-password - Cambiar contraseña
router.put('/change-password', verifyToken, changePassword);

module.exports = router; 