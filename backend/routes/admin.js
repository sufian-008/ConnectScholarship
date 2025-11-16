const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Setting = require('../models/Setting');
const { protect, adminOnly } = require('../middleware/auth');

// Apply admin middleware to all routes
router.use(protect);
router.use(adminOnly);

// @route   GET /api/admin/posts
// @desc    Get all posts (admin)
// @access  Private/Admin
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

// @route   GET /api/admin/stats
// @desc    Get dashboard stats
// @access  Private/Admin
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

// @route   PUT /api/admin/posts/:id/approve
// @desc    Approve a post
// @access  Private/Admin
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

// @route   PUT /api/admin/posts/:id/reject
// @desc    Reject a post
// @access  Private/Admin
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

// @route   DELETE /api/admin/posts/:id
// @desc    Delete any post (admin)
// @access  Private/Admin
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


// from user models

// @route   GET /api/admin/users
// @desc    Get all users (admin)
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role. Must be "user" or "admin"' 
      });
    }

    if (req.params.id === req.user.id && role === 'user') {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await Post.deleteMany({ author: req.params.id });
    await user.deleteOne();

    res.json({
      success: true,
      data: {},
      message: 'User and their posts deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get platform analytics
// @access  Private/Admin
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    const totalPosts = await Post.countDocuments();
    const approvedPosts = await Post.countDocuments({ status: 'approved' });
    const pendingPosts = await Post.countDocuments({ status: 'pending' });
    const rejectedPosts = await Post.countDocuments({ status: 'rejected' });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentPosts = await Post.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    const topContributors = await Post.aggregate([
      {
        $group: {
          _id: '$author',
          totalPosts: { $sum: 1 },
          approvedPosts: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          }
        }
      },
      { $sort: { totalPosts: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          name: { $arrayElemAt: ['$user.name', 0] },
          email: { $arrayElemAt: ['$user.email', 0] },
          totalPosts: 1,
          approvedPosts: 1
        }
      }
    ]);

    const postsByCountry = await Post.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const postsByFunding = await Post.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$fundingType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admins: adminUsers,
          regular: regularUsers
        },
        posts: {
          total: totalPosts,
          approved: approvedPosts,
          pending: pendingPosts,
          rejected: rejectedPosts
        },
        recentActivity: {
          posts: recentPosts,
          users: recentUsers
        },
        topContributors,
        postsByCountry,
        postsByFunding
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// from Setting
router.get('/settings', protect, adminOnly, async (req, res) => {
  try {
    const settings = await Setting.findOne({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update settings
router.put('/settings', protect, adminOnly, async (req, res) => {
  try {
    let settings = await Setting.findOne({});
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/activity', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const last7 = new Date();
    last7.setDate(today.getDate() - 6);
    last7.setHours(0, 0, 0, 0);

    // Aggregate posts by day
    const data = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: last7, $lte: today }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Build 7-day list with missing days = 0
    let finalResult = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(last7);
      d.setDate(last7.getDate() + i);

      const dateStr = d.toISOString().split("T")[0];
      const found = data.find(x => x._id === dateStr);

      finalResult.push({
        date: dateStr,
        count: found ? found.count : 0
      });
    }

    res.json({
      success: true,
      data: finalResult
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;