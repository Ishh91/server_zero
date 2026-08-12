const errorHandler = (err, req, res, next) => {
  if (err) {
    const url = (req.originalUrl || req.url || '').toString();
    console.error(`[ERROR] ${req.method} ${url} | ${err.name || 'Error'}: ${err.message}`);
    if (err.stack) {
      const preview = String(err.stack).split('\n').slice(0, 6).join('\n');
      console.error(preview);
    }
  }
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err?.message || 'Server error';

  if (err && (err.name === 'MulterError' || /multer/i.test(err.message || '') || /file too large/i.test(err.message || ''))) {
    statusCode = 413;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File is too large. Maximum allowed size is 100 MB. Upload a shorter/smaller video, or use the Video URL paste field instead.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected field name when uploading. Please try again or report to admin.';
    } else {
      message = err.message || 'File upload error.';
    }
  }
  if (err && err.name === 'ValidationError') {
    statusCode = 400;
    const parts = Object.values(err.errors || {}).map(e => e.message);
    if (parts.length) message = parts.join('; ');
  }
  if (err && err.name === 'CastError') {
    statusCode = 404;
    message = 'Record not found';
  }
  if (err && /Only images and videos are allowed/i.test(message)) {
    statusCode = 400;
  }

  res.status(statusCode);
  res.json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : (err && err.stack ? err.stack : null),
  });
};

module.exports = { errorHandler };