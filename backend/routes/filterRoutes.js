const express = require("express");
const router = express.Router();
const Post = require("../models/Post");


router.get("/countries", async (req, res) => {
  try {
    const countries = await Post.distinct("country");
    res.status(200).json({ success: true, data: countries });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


router.get("/opportunities", async (req, res) => {
  try {
    const opportunities = await Post.distinct("opportunity");
    res.status(200).json({ success: true, data: opportunities });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
