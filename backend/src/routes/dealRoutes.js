const express = require('express');
const router = express.Router();
const { getAllDeals, getDealById, createDeal, updateDeal, deleteDeal, updateDealStage } = require('../controllers/dealController');
const authMiddleware = require('../middleware/auth');

// GET /api/deals (with filtering support: ?stage=&process_type_id=&country=&product=)
router.get('/', authMiddleware, getAllDeals);

// GET /api/deals/:id
router.get('/:id', authMiddleware, getDealById);

// POST /api/deals
router.post('/', authMiddleware, createDeal);

// PUT /api/deals/:id
router.put('/:id', authMiddleware, updateDeal);

// DELETE /api/deals/:id
router.delete('/:id', authMiddleware, deleteDeal);

// PATCH /api/deals/:id/stage (update only the stage)
router.patch('/:id/stage', authMiddleware, updateDealStage);

module.exports = router;
