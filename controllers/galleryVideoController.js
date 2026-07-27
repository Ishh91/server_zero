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
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'zero-cineviv/gallery-videos',
        resource_type: 'video',
      });
      fs.unlinkSync(req.file.path);
      videoData.videoUrl = result.secure_url;
      videoData.videoPublicId = result.public_id;
    }

    const video = await GalleryVideo.create(videoData);
    res.status(201).json({
      success: true,
      data: video,
    });
  } catch (error) {
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
      if (video.videoPublicId) {
        await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: 'video' });
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'zero-cineviv/gallery-videos',
        resource_type: 'video',
      });
      fs.unlinkSync(req.file.path);
      updateData.videoUrl = result.secure_url;
      updateData.videoPublicId = result.public_id;
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
