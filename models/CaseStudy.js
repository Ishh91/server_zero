const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema({
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
  subtitle: {
    type: String,
    required: [true, 'Subtitle is required'],
  },
  client: {
    type: String,
    required: [true, 'Client name is required'],
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
  },
  engagementType: {
    type: String,
    required: [true, 'Engagement type is required'],
  },
  coreChallenge: {
    type: String,
    required: [true, 'Core challenge is required'],
  },
  deliveryModel: {
    type: String,
    required: [true, 'Delivery model is required'],
  },
  status: {
    type: String,
    enum: ['Live in production', 'In development', 'Coming soon'],
    default: 'Live in production',
  },
  technicalStack: [String],
  challengeDescription: {
    type: String,
    required: [true, 'Challenge description is required'],
  },
  whatWeBuilt: {
    type: String,
    required: [true, 'What we built is required'],
  },
  keyCapabilities: [String],
  technicalApproach: {
    type: String,
    required: [true, 'Technical approach is required'],
  },
  metrics: {
    metric1: {
      value: String,
      label: String,
    },
    metric2: {
      value: String,
      label: String,
    },
    metric3: {
      value: String,
      label: String,
    },
  },
  testimonial: {
    quote: String,
    author: String,
  },
  featuredImage: {
    type: String,
  },
  featuredImagePublicId: String,
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

// Create slug from title before validating
caseStudySchema.pre('validate', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model('CaseStudy', caseStudySchema);
