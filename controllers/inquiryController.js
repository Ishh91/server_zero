const Inquiry = require('../models/Inquiry');

const createInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Inquiry submitted successfully! We will contact you soon.',
      data: inquiry 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const inquiries = await Inquiry.find(query)
      .sort('-createdAt')
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10));

    const total = await Inquiry.countDocuments(query);

    res.json({
      success: true,
      count: inquiries.length,
      total,
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
};