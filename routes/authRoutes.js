const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', protect, admin, register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;