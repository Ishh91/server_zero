const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required'],
  },
  featuredImagePublicId: String,
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Marketing', 'Content Strategy', 'Video Production', 'Social Media', 'Case Studies', 'Industry Insights'],
    default: 'Marketing',
  },
  tags: [String],
  readTime: {
    type: Number,
    default: 5,
  },
  views: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  seoTitle: String,
  seoDescription: String,
}, {
  timestamps: true,
});

// Create slug from title before validating (runs before validation)
blogSchema.pre('validate', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);