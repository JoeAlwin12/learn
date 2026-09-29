const express = require('express');
const router = express.Router();
const { getAllProcessTypes, getProcessTypeById, createProcessType, updateProcessType, deleteProcessType } = require('../controllers/processTypeController');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/auth');

router.get('/', authMiddleware, getAllProcessTypes);
router.get('/:id', authMiddleware, getProcessTypeById);
router.post('/', authMiddleware, requireRole('admin'), createProcessType);
router.put('/:id', authMiddleware, requireRole('admin'), updateProcessType);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteProcessType);

module.exports = router;