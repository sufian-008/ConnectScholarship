const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  opportunity: {
    type: String,
    required: [true, 'Please add an opportunity title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  country: {
    type: String,
    required: [true, 'Please add a country'],
    trim: true
  },
  fundingType: {
    type: String,
    required: [true, 'Please add funding type'],
    enum: ['Full', 'Partial', 'None']
  },
  deadline: {
    type: Date,
    required: [true, 'Please add a deadline']
  },
  officialLink: {
    type: String,
    trim: true,
    match: [
      /^https?:\/\/.+/,
      'Please add a valid URL'
    ]
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
PostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Post', PostSchema)