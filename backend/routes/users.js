const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { verifyToken, requireAdmin, requireAdminOrManager } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/users - Obtener todos los usuarios (Admin/Manager)
router.get('/', requireAdminOrManager, getAllUsers);

// GET /api/users/:id - Obtener usuario por ID (Admin/Manager)
router.get('/:id', requireAdminOrManager, getUserById);

// POST /api/users - Crear nuevo usuario (Solo Admin)
router.post('/', requireAdmin, createUser);

// PUT /api/users/:id - Actualizar usuario (Solo Admin)
router.put('/:id', requireAdmin, updateUser);

// DELETE /api/users/:id - Eliminar usuario (Solo Admin)
router.delete('/:id', requireAdmin, deleteUser);

module.exports = router; 