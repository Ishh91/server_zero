const express = require('express');
const { getSettings, updateSettings } = require('../controllers/siteSettingsController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, admin, upload.single('heroVideo'), updateSettings);

module.exports = router;
