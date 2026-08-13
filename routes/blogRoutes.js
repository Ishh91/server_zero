const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getAdminBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getFeaturedBlogs,
  getBlogsByCategory,
} = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateBlog } = require('../middleware/validatorMiddleware');

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/category/:category', getBlogsByCategory);
router.get('/:slug', getBlogBySlug);

// Admin routes
router.get('/admin/all', protect, admin, getAdminBlogs);
router.post('/', protect, admin, validateBlog, createBlog);
router.put('/:id', protect, admin, validateBlog, updateBlog);
router.delete('/:id', protect, admin, deleteBlog);
router.get('/admin/:id', protect, admin, getBlogById);

module.exports = router;