const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// @route   POST /api/subscribe

router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if already subscribed
    const existing = await Subscription.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    // Save new subscription
    const newSub = await Subscription.create({ email });
    res.status(201).json({ message: 'Successfully subscribed', subscription: newSub });
  } catch (error) {
    console.error('Subscription Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;