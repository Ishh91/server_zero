const express = require('express');
const router = express.Router();
const {
  getPortfolio,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require('../controllers/portfolioController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadPortfolioMedia } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getPortfolio);
router.get('/:id', getPortfolioById);

// Admin routes
router.post('/', protect, admin, uploadPortfolioMedia, createPortfolio);
router.put('/:id', protect, admin, uploadPortfolioMedia, updatePortfolio);
router.delete('/:id', protect, admin, deletePortfolio);

module.exports = router;