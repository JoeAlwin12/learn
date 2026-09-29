const express = require('express');
const router = express.Router();
const { login, logout, me } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', authMiddleware, logout);

// GET /api/auth/me
router.get('/me', authMiddleware, me);

module.exports = router;
