const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes
const teamRoutes = require('./routes/teamRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const authRoutes = require('./routes/authRoutes');

const blogRoutes = require('./routes/blogRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const personalBrandingRoutes = require('./routes/personalBrandingRoutes');
const siteSettingsRoutes = require('./routes/siteSettingsRoutes');
const galleryVideoRoutes = require('./routes/galleryVideoRoutes');
const caseStudyRoutes = require('./routes/caseStudyRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

// CORS configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'https://server-zero.onrender.com',
  'https://zerotushar.netlify.app',
  'http://zerobycineviv.com',
  'https://zerobycineviv.com',
  'http://shiny-phoenix-353228.netlify.app',
  'https://shiny-phoenix-353228.netlify.app',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('localhost') || origin.endsWith('.netlify.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_MAX),
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const connectDB = require('./config/database');
connectDB();

// API Routes
app.use('/api/team', teamRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/personal-branding', personalBrandingRoutes);
app.use('/api/site-settings', siteSettingsRoutes);
app.use('/api/gallery-videos', galleryVideoRoutes);
app.use('/api/case-studies', caseStudyRoutes);

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ZERO BY CINEVIV API Server',
    description: 'Content-Led Marketing Agency Backend API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      portfolio: '/api/portfolio',
      team: '/api/team',
      testimonials: '/api/testimonials',
      inquiries: '/api/inquiries',
      blogs: '/api/blogs',
      media: '/api/media',
      personalBranding: '/api/personal-branding',
      siteSettings: '/api/site-settings',
      galleryVideos: '/api/gallery-videos',
      admin: '/api/admin/*',
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'ZERO BY CINEVIV API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});