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

const safeUpload = (name) => (req, res, next) => {
  const handler = upload.single(name);
  handler(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

router.get('/', getAllGalleryVideos);
router.get('/admin', protect, admin, getAllGalleryVideosAdmin);
router.post('/', protect, admin, safeUpload('video'), createGalleryVideo);
router.put('/:id', protect, admin, safeUpload('video'), updateGalleryVideo);
router.delete('/:id', protect, admin, deleteGalleryVideo);

module.exports = router;
