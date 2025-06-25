const express = require('express');
const router = express.Router();
const {
  getPrompts,
  getPromptById,
  getUserPrompts,
  getProductPrompts,
  updatePrompt,
  deletePrompt,
  getPromptStats
} = require('../controllers/promptController');
const { verifyToken, requireAdminOrManager } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/prompts - Obtener todos los prompts con filtros
router.get('/', getPrompts);

// GET /api/prompts/stats - Obtener estadísticas de prompts
router.get('/stats', getPromptStats);

// GET /api/prompts/user/:userId? - Obtener prompts de un usuario
router.get('/user/:userId?', getUserPrompts);

// GET /api/prompts/product/:productId - Obtener prompts de un producto
router.get('/product/:productId', getProductPrompts);

// GET /api/prompts/:id - Obtener prompt por ID
router.get('/:id', getPromptById);

// PUT /api/prompts/:id - Actualizar prompt (solo título y descripción)
router.put('/:id', updatePrompt);

// DELETE /api/prompts/:id - Eliminar prompt (solo owner o admin)
router.delete('/:id', deletePrompt);

module.exports = router; 