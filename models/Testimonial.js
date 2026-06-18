const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
  },
  clientRole: String,
  company: String,
  content: {
    type: String,
    required: [true, 'Testimonial content is required'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  imageUrl: String,
  videoUrl: String,
  isVideo: {
    type: Boolean,
    default: false,
  },
  metrics: {
    reach: String,
    engagement: String,
    leads: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Testimonial', testimonialSchema);