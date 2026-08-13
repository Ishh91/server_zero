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
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      mediaSrc: ["'self'", "blob:", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https:", "http:", "wss:", "ws:"],
      frameSrc: ["'self'", "https:", "http:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"]
    }
  }
}));

// Prevent ERR_CACHE_OPERATION_NOT_SUPPORTED on video byte-range requests
app.use((req, res, next) => {
  const isVideo = /\.(mp4|webm|ogv|mov)(\?|#|$)/i.test(req.url);
  if (isVideo) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('X-Accel-Buffering', 'no');
  }
  next();
});

app.use(compression());

// Cache headers for public read-only GET endpoints (2 mins browser/CDN cache)
app.use((req, res, next) => {
  if (
    req.method === 'GET' &&
    req.url.startsWith('/api/') &&
    !req.url.startsWith('/api/admin') &&
    !req.url.startsWith('/api/auth') &&
    !req.url.startsWith('/api/inquiries')
  ) {
    res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
  }
  next();
});

// CORS configuration
const rawOrigins = [
  process.env.CORS_ORIGIN,
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split('||').map(s => s.trim()) : []),
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://zerotushar.netlify.app',
  'https://zerobycineviv.com',
  'http://zerobycineviv.com',
  'https://shiny-phoenix-353228.netlify.app',
  'https://server-zero.onrender.com'
].filter(Boolean);

const allowedOrigins = [...new Set(rawOrigins)];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow local development hostnames in development mode only
    if (process.env.NODE_ENV !== 'production') {
      const isLocalDev = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin);
      if (isLocalDev) {
        return callback(null, true);
      }
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 150,
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