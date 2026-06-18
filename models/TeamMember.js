const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
  },
  expertise: [{
    type: String,
    trim: true,
  }],
  imageUrl: {
    type: String,
    default: '',
  },
  imagePublicId: String,
  socialLinks: {
    linkedin: String,
    instagram: String,
    twitter: String,
  },
  email: String,
  phone: String,
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

module.exports = mongoose.model('TeamMember', teamMemberSchema);