const CaseStudy = require('../models/CaseStudy');

const getCaseStudies = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = { published: true };
    
    const caseStudies = await CaseStudy.find(query)
      .sort('-publishedAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await CaseStudy.countDocuments(query);
    
    res.json({
      success: true,
      data: caseStudies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find().sort('-publishedAt');
    res.json({ success: true, data: caseStudies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCaseStudyBySlug = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findOne({ slug: req.params.slug, published: true });
    if (!caseStudy) {
      return res.status(404).json({ success: false, message: 'Case study not found' });
    }
    
    res.json({ success: true, data: caseStudy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeaturedCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find({ featured: true, published: true })
      .sort('-publishedAt')
      .limit(3);
    res.json({ success: true, data: caseStudies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCaseStudy = async (req, res) => {
  try {
    const { title, ...rest } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const caseStudy = await CaseStudy.create({ title, slug, ...rest });
    res.status(201).json({ success: true, data: caseStudy });
  } catch (error) {
    console.error('Case study creation error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCaseStudy = async (req, res) => {
  try {
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
    
    const caseStudy = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!caseStudy) {
      return res.status(404).json({ success: false, message: 'Case study not found' });
    }
    res.json({ success: true, data: caseStudy });
  } catch (error) {
    console.error('Case study update error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({ success: false, message: 'Case study not found' });
    }
    await caseStudy.deleteOne();
    res.json({ success: true, message: 'Case study deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCaseStudyById = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({ success: false, message: 'Case study not found' });
    }
    res.json({ success: true, data: caseStudy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCaseStudies,
  getAdminCaseStudies,
  getCaseStudyBySlug,
  getCaseStudyById,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  getFeaturedCaseStudies,
};
