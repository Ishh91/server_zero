const Portfolio = require('../models/Portfolio');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const getPortfolio = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    const portfolio = await Portfolio.find(filter)
      .sort('order')
      .select('-__v');
    res.json({
      success: true,
      count: portfolio.length,
      data: portfolio
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPortfolioById = async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPortfolio = async (req, res) => {
  try {
    // Parse the JSON data from form-data
    let portfolioData = {};
    if (req.body.data) {
      portfolioData = JSON.parse(req.body.data);
    } else {
      portfolioData = req.body;
    }
    
    // Handle media upload
    if (req.files) {
      // Handle video upload
      if (req.files.video && req.files.video[0]) {
        const videoResult = await cloudinary.uploader.upload(req.files.video[0].path, {
          folder: 'zero-cineviv/portfolio',
          resource_type: 'video',
        });
        portfolioData.videoUrl = videoResult.secure_url;
        portfolioData.videoPublicId = videoResult.public_id;
      }
      
      // Handle thumbnail upload
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbnailResult = await cloudinary.uploader.upload(req.files.thumbnail[0].path, {
          folder: 'zero-cineviv/portfolio',
          transformation: [{ width: 800, height: 600, crop: 'fill' }]
        });
        portfolioData.thumbnailUrl = thumbnailResult.secure_url;
        portfolioData.thumbnailPublicId = thumbnailResult.public_id;
      }
    }
    
    const portfolio = await Portfolio.create(portfolioData);
    res.status(201).json({ success: true, data: portfolio });
  } catch (error) {
    console.error('Portfolio creation error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to create portfolio item' });
  } finally {
    if (req.files) {
      ['video', 'thumbnail'].forEach(key => {
        if (req.files[key] && req.files[key][0] && fs.existsSync(req.files[key][0].path)) {
          try {
            fs.unlinkSync(req.files[key][0].path);
          } catch (e) {
            console.error(`Error deleting temp file ${key}:`, e);
          }
        }
      });
    }
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }
    
    // Parse the JSON data from form-data
    let updateData = {};
    if (req.body.data) {
      updateData = JSON.parse(req.body.data);
    } else {
      updateData = req.body;
    }
    
    // Handle new media uploads
    if (req.files) {
      // Handle video upload
      if (req.files.video && req.files.video[0]) {
        if (portfolio.videoPublicId) {
          await cloudinary.uploader.destroy(portfolio.videoPublicId, { resource_type: 'video' });
        }
        const videoResult = await cloudinary.uploader.upload(req.files.video[0].path, {
          folder: 'zero-cineviv/portfolio',
          resource_type: 'video',
        });
        updateData.videoUrl = videoResult.secure_url;
        updateData.videoPublicId = videoResult.public_id;
      }
      
      // Handle thumbnail upload
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        if (portfolio.thumbnailPublicId) {
          await cloudinary.uploader.destroy(portfolio.thumbnailPublicId);
        }
        const thumbnailResult = await cloudinary.uploader.upload(req.files.thumbnail[0].path, {
          folder: 'zero-cineviv/portfolio',
          transformation: [{ width: 800, height: 600, crop: 'fill' }]
        });
        updateData.thumbnailUrl = thumbnailResult.secure_url;
        updateData.thumbnailPublicId = thumbnailResult.public_id;
      }
    }
    
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: updatedPortfolio });
  } catch (error) {
    console.error('Portfolio update error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to update portfolio item' });
  } finally {
    if (req.files) {
      ['video', 'thumbnail'].forEach(key => {
        if (req.files[key] && req.files[key][0] && fs.existsSync(req.files[key][0].path)) {
          try {
            fs.unlinkSync(req.files[key][0].path);
          } catch (e) {
            console.error(`Error deleting temp file ${key}:`, e);
          }
        }
      });
    }
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }
    
    // Delete media from Cloudinary
    if (portfolio.videoPublicId) {
      await cloudinary.uploader.destroy(portfolio.videoPublicId, { resource_type: 'video' });
    }
    if (portfolio.thumbnailPublicId) {
      await cloudinary.uploader.destroy(portfolio.thumbnailPublicId);
    }
    
    await portfolio.deleteOne();
    res.json({ success: true, message: 'Portfolio item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPortfolio,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
};