const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateLogin } = require('../middleware/validatorMiddleware');

router.post('/register', protect, admin, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

module.exports = router;