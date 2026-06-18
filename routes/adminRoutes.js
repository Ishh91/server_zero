const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const Blog = require('../models/Blog');
const Media = require('../models/Media');
const TeamMember = require('../models/TeamMember');
const Portfolio = require('../models/Portfolio');

// Dashboard stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    const pendingInquiries = await Inquiry.countDocuments({ status: 'pending' });
    const totalMedia = await Media.countDocuments();
    const totalTeam = await TeamMember.countDocuments();
    const totalPortfolio = await Portfolio.countDocuments();
    
    res.json({
      success: true,
      data: {
        totalBlogs,
        totalInquiries,
        pendingInquiries,
        totalMedia,
        totalTeam,
        totalPortfolio,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user role
router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;