const { prisma } = require('../db');

/**
 * Middleware para verificar que el usuario es propietario del producto
 * o es admin/manager
 */
const checkProductOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Admin y Manager pueden acceder a todos los productos
    if (userRole === 'ADMIN' || userRole === 'MANAGER') {
      return next();
    }

    // Verificar si el producto existe y pertenece al usuario
    const product = await prisma.product.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado o no tienes permisos para acceder a él'
      });
    }

    // Añadir el producto al request para uso posterior
    req.product = product;
    next();

  } catch (error) {
    console.error('Error verificando propiedad del producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  checkProductOwnership
}; 