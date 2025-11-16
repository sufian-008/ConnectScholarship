const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); 


function extractSearchParams(message) {
  const lowerMessage = message.toLowerCase();
  const searchParams = {};

  // Countries
  const countries = ['usa', 'uk', 'canada', 'germany', 'australia', 'japan', 'france'];
  for (const country of countries) {
    if (lowerMessage.includes(country)) {
      searchParams.country = country;
      break;
    }
  }

  // Funding type
  if (lowerMessage.includes('fully funded') || lowerMessage.includes('full funding')) {
    searchParams.fundingType = 'Full';
  } else if (lowerMessage.includes('partial')) {
    searchParams.fundingType = 'Partial';
  }

  // Keywords
  const keywords = ['engineering', 'medicine', 'business', 'arts', 'science', 'phd', 'masters', 'undergraduate'];
  for (const keyword of keywords) {
    if (lowerMessage.includes(keyword)) {
      searchParams.keyword = keyword;
      break;
    }
  }

  return searchParams;
}

// Generate a simple response
function generateResponse(scholarships, params) {
  if (scholarships.length === 0) {
    return "I couldn't find any scholarships matching your criteria. Try broadening your search!";
  }

  let response = `I found ${scholarships.length} scholarship(s) `;
  if (params.country) response += `in ${params.country} `;
  if (params.fundingType) response += `with ${params.fundingType} funding `;
  if (params.keyword) response += `related to ${params.keyword} `;
  response += ". Check the results below!";

  return response;
}


router.post('/query', async (req, res) => {
  try {
    const { message } = req.body;

    // Extract search parameters
    const params = extractSearchParams(message);

    // Search database
    let query = { status: 'approved' };
    if (params.country) query.country = { $regex: params.country, $options: 'i' };
    if (params.fundingType) query.fundingType = params.fundingType;
    if (params.keyword) {
      query.$or = [
        { opportunity: { $regex: params.keyword, $options: 'i' } },
        { description: { $regex: params.keyword, $options: 'i' } }
      ];
    }

    const scholarships = await Post.find(query).sort({ deadline: 1 }).limit(5);

    // Generate response
    const aiResponse = generateResponse(scholarships, params);

    res.json({ success: true, response: aiResponse, scholarships, searchParams: params });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ success: false, message: 'Failed to process query' });
  }
});

// Route: quick suggestions
router.get('/suggestions', (req, res) => {
  const suggestions = [
    "Show me fully funded scholarships",
    "Find scholarships in USA",
    "Scholarships with upcoming deadlines",
    "Engineering scholarships",
    "Masters degree opportunities"
  ];
  res.json({ success: true, suggestions });
});

module.exports = router;
