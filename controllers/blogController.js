const Blog = require('../models/Blog');

const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const query = { published: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const blogs = await Blog.find(query)
      .sort('-publishedAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content');
    
    const total = await Blog.countDocuments(query);
    
    res.json({
      success: true,
      data: blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort('-publishedAt');
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ featured: true, published: true })
      .sort('-publishedAt')
      .limit(3)
      .select('-content');
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBlogsByCategory = async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      category: req.params.category, 
      published: true 
    })
      .sort('-publishedAt')
      .select('-content');
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, ...rest } = req.body;
    
    // Check required fields first
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    
    // Explicitly generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    console.log('Creating blog with:', { title, slug, ...rest });
    
    const blog = await Blog.create({ title, slug, ...rest });
    console.log('Blog created:', blog);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    console.error('Blog creation error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    // If title is changing, generate new slug
    const { title, ...rest } = req.body;
    let updateData = rest;
    
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      updateData = { title, slug, ...rest };
    }
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    console.error('Blog update error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    await blog.deleteOne();
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBlogs,
  getAdminBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getFeaturedBlogs,
  getBlogsByCategory,
};