const Media = require('../models/Media');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadMedia = async (req, res) => {
  try {
    console.log('Media upload request received');
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Upload to Cloudinary
    const resourceType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    console.log('Uploading to Cloudinary, resource type:', resourceType);
    
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'zero-cineviv/media',
      resource_type: resourceType,
    });
    
    console.log('Cloudinary upload successful:', result.public_id);
    
    // Delete local file
    fs.unlinkSync(req.file.path);
    
    const media = await Media.create({
      filename: result.public_id.split('/').pop(),
      originalName: req.file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
      type: resourceType,
      mimeType: req.file.mimetype,
      size: req.file.size,
      alt: req.body.alt || '',
      uploadedBy: req.user.id,
    });
    
    res.status(201).json({ success: true, data: media });
  } catch (error) {
    console.error('Media upload error:', error);
    res.status(400).json({ success: false, message: error.message, stack: error.stack });
  }
};

const getMedia = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const query = {};
    if (type && type !== 'all') {
      query.type = type;
    }
    
    const media = await Media.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('uploadedBy', 'name email');
    
    const total = await Media.countDocuments(query);
    
    res.json({
      success: true,
      data: media,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(media.publicId, {
      resource_type: media.type,
    });
    
    await media.deleteOne();
    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadMedia, getMedia, deleteMedia };