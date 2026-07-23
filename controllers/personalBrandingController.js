const PersonalBranding = require('../models/PersonalBranding');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Helper function to map data to stats if needed
const mapDataToStats = (item) => {
  const itemObj = item.toObject ? item.toObject() : item;
  // If stats is empty or not present, use data (map metric to label)
  if ((!itemObj.stats || itemObj.stats.length === 0) && itemObj.data && itemObj.data.length > 0) {
    return {
      ...itemObj,
      stats: itemObj.data.map(d => ({
        label: d.metric,
        value: d.value,
        icon: d.icon
      }))
    };
  }
  return itemObj;
};

// @desc    Get all personal branding entries
// @route   GET /api/personal-branding
// @access  Public
exports.getAllPersonalBranding = async (req, res, next) => {
  try {
    const personalBrandings = await PersonalBranding.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    // Map data to stats for each entry for frontend compatibility
    const mappedPersonalBrandings = personalBrandings.map(mapDataToStats);

    res.status(200).json({
      success: true,
      count: mappedPersonalBrandings.length,
      data: mappedPersonalBrandings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single personal branding entry
// @route   GET /api/personal-branding/:id
// @access  Public
exports.getPersonalBranding = async (req, res, next) => {
  try {
    const personalBranding = await PersonalBranding.findById(req.params.id);

    if (!personalBranding) {
      return res.status(404).json({
        success: false,
        message: 'Personal branding entry not found',
      });
    }

    // Map data to stats for frontend compatibility
    const mappedPersonalBranding = mapDataToStats(personalBranding);

    res.status(200).json({
      success: true,
      data: mappedPersonalBranding,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create personal branding entry
// @route   POST /api/personal-branding
// @access  Private (Admin)
exports.createPersonalBranding = async (req, res, next) => {
  try {
    console.log('Personal branding creation request');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    
    let personalBrandingData;
    if (typeof req.body.data === 'string') {
      personalBrandingData = JSON.parse(req.body.data);
    } else if (req.body.data) {
      personalBrandingData = req.body.data;
    } else {
      personalBrandingData = { ...req.body };
    }
    
    console.log('personalBrandingData:', personalBrandingData);
    
    if (req.file) {
      console.log('Uploading avatar to Cloudinary');
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'zero-cineviv/personal-branding',
        transformation: [{ width: 500, height: 500, crop: 'fill' }]
      });
      fs.unlinkSync(req.file.path);
      personalBrandingData.avatarUrl = result.secure_url;
      personalBrandingData.avatarPublicId = result.public_id;
    }
    
    const personalBranding = await PersonalBranding.create(personalBrandingData);

    res.status(201).json({
      success: true,
      data: personalBranding,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update personal branding entry
// @route   PUT /api/personal-branding/:id
// @access  Private (Admin)
exports.updatePersonalBranding = async (req, res, next) => {
  try {
    console.log('Personal branding update request');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    
    const personalBranding = await PersonalBranding.findById(req.params.id);
    if (!personalBranding) {
      return res.status(404).json({
        success: false,
        message: 'Personal branding entry not found',
      });
    }
    
    let updateData;
    if (typeof req.body.data === 'string') {
      updateData = JSON.parse(req.body.data);
    } else if (req.body.data) {
      updateData = req.body.data;
    } else {
      updateData = { ...req.body };
    }
    
    console.log('updateData:', updateData);
    
    if (req.file) {
      if (personalBranding.avatarPublicId) {
        await cloudinary.uploader.destroy(personalBranding.avatarPublicId);
      }
      
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'zero-cineviv/personal-branding',
        transformation: [{ width: 500, height: 500, crop: 'fill' }]
      });
      fs.unlinkSync(req.file.path);
      updateData.avatarUrl = result.secure_url;
      updateData.avatarPublicId = result.public_id;
    }
    
    const updated = await PersonalBranding.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete personal branding entry
// @route   DELETE /api/personal-branding/:id
// @access  Private (Admin)
exports.deletePersonalBranding = async (req, res, next) => {
  try {
    const personalBranding = await PersonalBranding.findById(req.params.id);
    if (!personalBranding) {
      return res.status(404).json({
        success: false,
        message: 'Personal branding entry not found',
      });
    }
    
    if (personalBranding.avatarPublicId) {
      await cloudinary.uploader.destroy(personalBranding.avatarPublicId);
    }
    
    await personalBranding.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Personal branding entry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
