const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Fashion', 'Food', 'Lifestyle', 'Brand Commercials', 'Events', 'Personal Branding', 'Product Shoots', 'Social Media Ads'],
  },
  videoUrl: {
    type: String,
    required: [true, 'Video file is required'],
  },
  videoPublicId: String,
  thumbnailUrl: String,
  thumbnailPublicId: String,
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  client: {
    type: String,
    required: [true, 'Client name is required'],
  },
  results: {
    views: String,
    engagement: String,
    conversions: String,
    reach: String,
    saves: String,
    shares: String,
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Portfolio', portfolioSchema);