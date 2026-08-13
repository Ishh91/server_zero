const TeamMember = require('../models/TeamMember');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true })
      .sort('order')
      .select('-__v');
    res.json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.json({ success: true, data: teamMember });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTeamMember = async (req, res) => {
  const filePath = req.file ? req.file.path : null;

  try {
    let teamMemberData;
    if (typeof req.body.data === 'string') {
      teamMemberData = JSON.parse(req.body.data);
    } else if (req.body.data) {
      teamMemberData = req.body.data;
    } else {
      teamMemberData = { ...req.body };
    }
    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'zero-cineviv/team',
        transformation: [{ width: 500, height: 500, crop: 'fill' }]
      });
      teamMemberData.imageUrl = result.secure_url;
      teamMemberData.imagePublicId = result.public_id;
    }
    
    const teamMember = await TeamMember.create(teamMemberData);
    res.status(201).json({ success: true, data: teamMember });
  } catch (error) {
    console.error('Team member creation error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to create team member' });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        console.error('Error cleaning up local file:', unlinkErr);
      }
    }
  }
};

const updateTeamMember = async (req, res) => {
  const filePath = req.file ? req.file.path : null;

  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    
    let updateData;
    if (typeof req.body.data === 'string') {
      updateData = JSON.parse(req.body.data);
    } else if (req.body.data) {
      updateData = req.body.data;
    } else {
      updateData = { ...req.body };
    }
    
    if (req.file) {
      if (teamMember.imagePublicId) {
        await cloudinary.uploader.destroy(teamMember.imagePublicId);
      }
      
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'zero-cineviv/team',
        transformation: [{ width: 500, height: 500, crop: 'fill' }]
      });
      updateData.imageUrl = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }
    
    const updatedMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: updatedMember });
  } catch (error) {
    console.error('Team member update error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to update team member' });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        console.error('Error cleaning up local file:', unlinkErr);
      }
    }
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    
    // Delete image from Cloudinary
    if (teamMember.imagePublicId) {
      await cloudinary.uploader.destroy(teamMember.imagePublicId);
    }
    
    await teamMember.deleteOne();
    res.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};