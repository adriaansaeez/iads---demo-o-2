const jwt = require('jsonwebtoken');
const { prisma } = require('../db');

// Middleware para verificar JWT
const verifyToken = async (req, res, next) => {
  try {
    // Obtener token del header Authorization o cookies
    let token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token && req.cookies) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Acceso denegado. Token no proporcionado.'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Obtener usuario de la base de datos
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        isActive: true 
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        created_at: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido. Usuario no encontrado.'
      });
    }

    // Añadir usuario al request
    req.user = user;
    next();

  } catch (error) {
    console.error('Error verificando token:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor.'
    });
  }
};

// Middleware para verificar roles específicos
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Permisos insuficientes para acceder a este recurso.'
      });
    }

    next();
  };
};

// Middleware para verificar si es admin
const requireAdmin = requireRole('ADMIN');

// Middleware para verificar si es admin o manager
const requireAdminOrManager = requireRole('ADMIN', 'MANAGER');

// Middleware opcional de autenticación (no falla si no hay token)
const optionalAuth = async (req, res, next) => {
  try {
    let token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token && req.cookies) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { 
          id: decoded.userId,
          isActive: true 
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          created_at: true
        }
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // En caso de error, continuar sin usuario autenticado
    next();
  }
};

module.exports = {
  verifyToken,
  requireRole,
  requireAdmin,
  requireAdminOrManager,
  optionalAuth
}; 