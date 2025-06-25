const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUserProductsForSelector
} = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/dashboard/stats - Obtener estadísticas del dashboard
router.get('/stats', getDashboardStats);

// GET /api/dashboard/products - Obtener productos del usuario para selector
router.get('/products', getUserProductsForSelector);

module.exports = router; 