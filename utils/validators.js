const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,5}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
};

const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '')
    .trim();
};

const validatePortfolioItem = (data) => {
  const errors = [];
  
  if (!data.title || data.title.length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  
  if (!data.category) {
    errors.push('Category is required');
  }
  
  if (!data.description || data.description.length < 20) {
    errors.push('Description must be at least 20 characters');
  }
  
  if (!data.client) {
    errors.push('Client name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateBlogPost = (data) => {
  const errors = [];
  
  if (!data.title || data.title.length < 5) {
    errors.push('Title must be at least 5 characters');
  }
  
  if (!data.content || data.content.length < 100) {
    errors.push('Content must be at least 100 characters');
  }
  
  if (!data.excerpt || data.excerpt.length < 20) {
    errors.push('Excerpt must be at least 20 characters');
  }
  
  if (!data.author) {
    errors.push('Author is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateInquiry = (data) => {
  const errors = [];
  
  if (!data.name || data.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.phone || !validatePhone(data.phone)) {
    errors.push('Valid phone number is required');
  }
  
  if (!data.message || data.message.length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePhone,
  validateUrl,
  sanitizeInput,
  validatePortfolioItem,
  validateBlogPost,
  validateInquiry
};