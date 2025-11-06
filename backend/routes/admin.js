const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect, adminOnly } = require('../middleware/auth');

// middleware
router.use(protect);
router.use(adminOnly);

// route   GET /api/admin/posts
//     Get all posts (admin)
// access  Private/Admin
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email');

    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// route   GET /api/admin/stats
// desc    Get dashboard stats
// access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const total = await Post.countDocuments();
    const approved = await Post.countDocuments({ status: 'approved' });
    const pending = await Post.countDocuments({ status: 'pending' });
    const rejected = await Post.countDocuments({ status: 'rejected' });

    res.json({
      success: true,
      data: {
        total,
        approved,
        pending,
        rejected
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// route   PUT /api/admin/posts/:id/approve
//     Approve a post
// access  Private/Admin
router.put('/posts/:id/approve', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// route   PUT /api/admin/posts/:id/reject
//     Reject a post
//   Private/Admin
router.put('/posts/:id/reject', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//    DELETE /api/admin/posts/:id
//     Delete any post (admin)
//   Private/Admin
router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    await post.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;


