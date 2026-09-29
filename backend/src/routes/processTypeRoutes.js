const express = require('express');
const router = express.Router();
const { getAllProcessTypes, getProcessTypeById, createProcessType, updateProcessType, deleteProcessType } = require('../controllers/processTypeController');
const authMiddleware = require('../middleware/auth');

// GET /api/process-types
router.get('/', authMiddleware, getAllProcessTypes);

// GET /api/process-types/:id
router.get('/:id', authMiddleware, getProcessTypeById);

// POST /api/process-types
router.post('/', authMiddleware, createProcessType);

// PUT /api/process-types/:id
router.put('/:id', authMiddleware, updateProcessType);

// DELETE /api/process-types/:id
router.delete('/:id', authMiddleware, deleteProcessType);

module.exports = router;
