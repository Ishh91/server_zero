const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: errorList.join('; '),
      errors: errors.array()
    });
  }
  next();
};

const validateInquiry = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 3000 }),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 20 }),
  body('company').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  handleValidationErrors
];

const validateLogin = [
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateBlog = [
  body('title').trim().notEmpty().withMessage('Blog title is required').isLength({ max: 300 }),
  body('category').optional().trim(),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateInquiry,
  validateLogin,
  validateBlog
};
