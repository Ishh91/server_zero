const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  budget: {
    type: String,
    enum: ['<₹50,000', '₹50,000 - ₹2,00,000', '₹2,00,000 - ₹5,00,000', '>₹5,00,000', ''],
    default: '',
  },
  service: {
    type: String,
    enum: ['Content-Led Marketing', 'Social Media Management', 'Performance Marketing', 'Video Production', 'Personal Branding', 'Website Development', 'Other', ''],
    default: '',
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'converted', 'archived'],
    default: 'pending',
  },
  notes: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Inquiry', inquirySchema);