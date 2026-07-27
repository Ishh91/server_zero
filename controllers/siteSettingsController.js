const SiteSettings = require('../models/SiteSettings');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = new SiteSettings({});
    }

    let updateData = {};
    if (typeof req.body.data === 'string') {
      updateData = JSON.parse(req.body.data);
    } else if (req.body.data) {
      updateData = req.body.data;
    } else {
      updateData = { ...req.body };
    }

    if (req.file) {
      if (settings.heroVideoPublicId) {
        await cloudinary.uploader.destroy(settings.heroVideoPublicId, { resource_type: 'video' });
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'zero-cineviv/hero',
        resource_type: 'video',
      });
      fs.unlinkSync(req.file.path);
      updateData.heroVideoUrl = result.secure_url;
      updateData.heroVideoPublicId = result.public_id;
    }

    const updated = await SiteSettings.findByIdAndUpdate(
      settings._id,
      updateData,
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
