const express = require('express');
const {
  getAllGalleryVideos,
  getAllGalleryVideosAdmin,
  createGalleryVideo,
  updateGalleryVideo,
  deleteGalleryVideo,
} = require('../controllers/galleryVideoController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getAllGalleryVideos);
router.get('/admin', protect, admin, getAllGalleryVideosAdmin);
router.post('/', protect, admin, upload.single('video'), createGalleryVideo);
router.put('/:id', protect, admin, upload.single('video'), updateGalleryVideo);
router.delete('/:id', protect, admin, deleteGalleryVideo);

module.exports = router;
