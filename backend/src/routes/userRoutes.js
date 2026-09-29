const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// GET /api/users
router.get('/', authMiddleware, getAllUsers);

// GET /api/users/:id
router.get('/:id', authMiddleware, getUserById);

// POST /api/users
router.post('/', authMiddleware, createUser);

// PUT /api/users/:id
router.put('/:id', authMiddleware, updateUser);

// DELETE /api/users/:id
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
