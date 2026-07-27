const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  heroVideoUrl: {
    type: String,
    default: '',
  },
  heroVideoPublicId: {
    type: String,
    default: '',
  },
  heroPosterUrl: {
    type: String,
    default: '',
  },
  heroTitle: {
    type: String,
    default: 'EVERY SUCCESSFULL BRAND STARTS FROM ZERO',
  },
  heroSubtitle: {
    type: String,
    default: 'BUILD FROM SCRATCH',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
