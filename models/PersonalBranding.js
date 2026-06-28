const mongoose = require('mongoose');

const personalBrandingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  field: {
    type: String,
    required: [true, 'Field/Profession is required'],
    trim: true,
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  avatarPublicId: String,
  // Portfolio items
  reports: [{
    title: String,
    description: String,
    fileUrl: String,
    filePublicId: String,
  }],
  videos: [{
    title: String,
    description: String,
    videoUrl: String,
    thumbnailUrl: String,
  }],
  photos: [{
    title: String,
    imageUrl: String,
    imagePublicId: String,
  }],
  data: [{
    metric: String,
    value: String,
    icon: String,
  }],
  socialLinks: {
    linkedin: String,
    instagram: String,
    twitter: String,
    youtube: String,
    website: String,
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

module.exports = mongoose.model('PersonalBranding', personalBrandingSchema);
