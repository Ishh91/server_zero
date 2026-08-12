const GalleryVideo = require('../models/GalleryVideo');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.getAllGalleryVideos = async (req, res, next) => {
  try {
    const videos = await GalleryVideo.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllGalleryVideosAdmin = async (req, res, next) => {
  try {
    const videos = await GalleryVideo.find({}).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};

exports.createGalleryVideo = async (req, res, next) => {
  try {
    const videoData = {};
    if (typeof req.body.data === 'string') {
      Object.assign(videoData, JSON.parse(req.body.data));
    } else if (req.body.data) {
      Object.assign(videoData, req.body.data);
    } else {
      Object.assign(videoData, req.body);
    }

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'zero-cineviv/gallery-videos',
          resource_type: 'video',
          chunk_size: 6000000,
        });
        try { fs.unlinkSync(req.file.path); } catch (_) { /* ignore */ }
        videoData.videoUrl = result.secure_url;
        videoData.videoPublicId = result.public_id;
      } catch (cloudinaryErr) {
        try { fs.unlinkSync(req.file.path); } catch (_) { /* ignore */ }
        console.error('[GalleryVideo] Cloudinary upload failed:', cloudinaryErr);
        return res.status(400).json({
          success: false,
          message: cloudinaryErr?.message || 'Cloudinary upload failed — video may be too large or invalid. Try the video URL field instead or check API credentials.'
        });
      }
    }

    if (!videoData.videoUrl || !String(videoData.videoUrl).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Video is required. Either upload a video file, or paste a hosted video URL (Cloudinary / direct .mp4 link).'
      });
    }

    const video = await GalleryVideo.create(videoData);
    res.status(201).json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.error('[GalleryVideo] create failed:', error);
    if (error && error.name === 'ValidationError') {
      const firstMsg = Object.values(error.errors || {}).map(e => e.message).join('; ');
      return res.status(400).json({
        success: false,
        message: firstMsg || error.message || 'Validation error'
      });
    }
    next(error);
  }
};

exports.updateGalleryVideo = async (req, res, next) => {
  try {
    const video = await GalleryVideo.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Gallery video not found',
      });
    }

    let updateData = {};
    if (typeof req.body.data === 'string') {
      updateData = JSON.parse(req.body.data);
    } else if (req.body.data) {
      updateData = req.body.data;
    } else {
      updateData = { ...req.body };
    }

    if (req.file) {
      try {
        if (video.videoPublicId) {
          try {
            await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: 'video' });
          } catch (_) { /* ignore destroy errors */ }
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'zero-cineviv/gallery-videos',
          resource_type: 'video',
          chunk_size: 6000000,
        });
        try { fs.unlinkSync(req.file.path); } catch (_) { /* ignore */ }
        updateData.videoUrl = result.secure_url;
        updateData.videoPublicId = result.public_id;
      } catch (cloudinaryErr) {
        try { fs.unlinkSync(req.file.path); } catch (_) { /* ignore */ }
        console.error('[GalleryVideo] Cloudinary re-upload failed on update:', cloudinaryErr);
        return res.status(400).json({
          success: false,
          message: cloudinaryErr?.message || 'Cloudinary upload failed — try the video URL field instead or check API credentials.'
        });
      }
    }

    const hasExplicitVideoUrl = updateData.videoUrl && String(updateData.videoUrl).trim();
    const keepsExisting = !hasExplicitVideoUrl && video.videoUrl;

    if (!hasExplicitVideoUrl && !keepsExisting) {
      return res.status(400).json({
        success: false,
        message: 'Video is required. Either upload a new video file, or keep/paste a valid video URL (Cloudinary / direct .mp4 link).'
      });
    }

    const updated = await GalleryVideo.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('[GalleryVideo] update failed:', error);
    if (error && error.name === 'ValidationError') {
      const firstMsg = Object.values(error.errors || {}).map(e => e.message).join('; ');
      return res.status(400).json({
        success: false,
        message: firstMsg || error.message || 'Validation error'
      });
    }
    if (error && error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Gallery video not found' });
    }
    next(error);
  }
};

exports.deleteGalleryVideo = async (req, res, next) => {
  try {
    const video = await GalleryVideo.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Gallery video not found',
      });
    }

    if (video.videoPublicId) {
      await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: 'video' });
    }

    await video.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Gallery video deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
