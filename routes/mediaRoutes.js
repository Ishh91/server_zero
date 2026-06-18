const express = require('express');
const router = express.Router();
const {
  uploadMedia,
  getMedia,
  deleteMedia,
} = require('../controllers/mediaController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadMediaFile } = require('../middleware/uploadMiddleware');

router.post('/', protect, admin, uploadMediaFile, uploadMedia);
router.get('/', protect, admin, getMedia);
router.delete('/:id', protect, admin, deleteMedia);

module.exports = router;