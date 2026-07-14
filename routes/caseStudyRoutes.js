const express = require('express');
const router = express.Router();
const {
  getCaseStudies,
  getAdminCaseStudies,
  getCaseStudyBySlug,
  getCaseStudyById,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  getFeaturedCaseStudies,
} = require('../controllers/caseStudyController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCaseStudies);
router.get('/featured', getFeaturedCaseStudies);
router.get('/:slug', getCaseStudyBySlug);

// Admin routes
router.get('/admin/all', protect, admin, getAdminCaseStudies);
router.post('/', protect, admin, createCaseStudy);
router.put('/:id', protect, admin, updateCaseStudy);
router.delete('/:id', protect, admin, deleteCaseStudy);
router.get('/admin/:id', protect, admin, getCaseStudyById);

module.exports = router;
