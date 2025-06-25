const express = require('express');
const router = express.Router();
const {
  assignPromptToProduct,
  getUserProducts
} = require('../controllers/productPromptController');
const { verifyToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// POST /api/product-prompts/assign - Asignar prompt a producto
router.post('/assign', assignPromptToProduct);

// GET /api/product-prompts/user-products - Obtener productos del usuario
router.get('/user-products', getUserProducts);

module.exports = router; 