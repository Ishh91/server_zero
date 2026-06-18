const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  publicId: String,
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
  mimeType: String,
  size: Number,
  alt: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Media', mediaSchema);