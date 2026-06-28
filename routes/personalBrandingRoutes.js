const express = require('express');
const {
  getAllPersonalBranding,
  getPersonalBranding,
  createPersonalBranding,
  updatePersonalBranding,
  deletePersonalBranding,
} = require('../controllers/personalBrandingController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadPersonalBrandingAvatar } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllPersonalBranding);
router.get('/:id', getPersonalBranding);

// Admin protected routes
router.post('/', protect, admin, uploadPersonalBrandingAvatar, createPersonalBranding);
router.put('/:id', protect, admin, uploadPersonalBrandingAvatar, updatePersonalBranding);
router.delete('/:id', protect, admin, deletePersonalBranding);

module.exports = router;
