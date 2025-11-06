const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// route   GET /api/posts
//     Get all approved posts
// access  Public
router.get('/', async (req, res) => {
  try {
    const { opportunity, country, fundingType, page = 1, limit = 10 } = req.query;

    let query = { status: 'approved' };

    if (opportunity) {
      query.opportunity = { $regex: opportunity, $options: 'i' };
    }
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }
    if (fundingType) {
      query.fundingType = fundingType;
    }

    // Pagination calculation
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Get total number of approved posts
    const total = await Post.countDocuments(query);

    // Fetch posts with pagination
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('author', 'name email');

    res.json({
      success: true,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      totalPosts: total,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// route   GET /api/posts/my-posts
//   Get current user's posts
// access  Private
router.get('/my-posts', protect, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// route   POST /api/posts
// access  Private
router.post('/', [
  protect,
  body('opportunity').notEmpty().withMessage('Opportunity title is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('fundingType').isIn(['Full', 'Partial', 'None']).withMessage('Invalid funding type'),
  body('deadline').isISO8601().withMessage('Valid deadline date is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const postData = {
      ...req.body,
      author: req.user.id,
      authorName: req.user.name,
      status: 'pending'
    };

    const post = await Post.create(postData);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// route   PUT /api/posts/:id
//   Update a post
// access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // // Check ownership
    // if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    //   return res.status(403).json({ success: false, message: 'Not authorized' });
    // }

    // // Can only edit if pending
    // if (post.status !== 'reject' && req.user.role !== 'admin') {
    //   return res.status(400).json({ success: false, message: 'Cannot edit approved/rejected posts' });
    // }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// route   DELETE /api/posts/:id
//   Delete a post
// access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // // Check ownership
    // if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    //   return res.status(403).json({ success: false, message: 'Not authorized' });
    // }

    // // Can only delete if pending
    // if (post.status !== 'pending' && req.user.role !== 'admin') {
    //   return res.status(400).json({ success: false, message: 'Cannot delete approved/rejected posts' });
    // }

    await post.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// @route   PUT /api/posts/:id/request-update
//   User submits an update request for their post
// access  Private
router.put('/:id/request-update', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // Only allow if post is approved/rejected (cannot edit pending directly)
    // if (post.status === 'pending') {
    //   return res.status(400).json({ success: false, message: 'You can edit pending posts directly' });
    // }

    // // Check ownership
    // if (post.author.toString() !== req.user.id) {
    //   return res.status(403).json({ success: false, message: 'Not authorized' });
    // }

    post.updateRequest = {
      ...req.body,
      requestedAt: new Date()
    };

    await post.save();

    res.json({ success: true, message: 'Update request submitted', data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



module.exports = router;

