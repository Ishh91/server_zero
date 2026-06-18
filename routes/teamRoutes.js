const express = require('express');
const router = express.Router();
const {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/teamController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadTeamImage } = require('../middleware/uploadMiddleware');

router.get('/', getTeamMembers);
router.get('/:id', getTeamMemberById);
router.post('/', protect, admin, uploadTeamImage, createTeamMember);
router.put('/:id', protect, admin, uploadTeamImage, updateTeamMember);
router.delete('/:id', protect, admin, deleteTeamMember);

module.exports = router;