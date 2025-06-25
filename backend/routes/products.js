const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { verifyToken, requireAdminOrManager } = require('../middleware/auth');
const { checkProductOwnership } = require('../middleware/productOwnership');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/products - Obtener todos los productos
router.get('/', getAllProducts);

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', getProductById);

// POST /api/products - Crear nuevo producto (cualquier usuario autenticado)
router.post('/', createProduct);

// PUT /api/products/:id - Actualizar producto (Admin/Manager o propietario)
router.put('/:id', checkProductOwnership, updateProduct);

// DELETE /api/products/:id - Eliminar producto (Admin/Manager o propietario)
router.delete('/:id', checkProductOwnership, deleteProduct);

module.exports = router; 