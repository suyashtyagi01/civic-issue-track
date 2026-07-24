// backend/models/Issue.js
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['pothole', 'lighting', 'sanitation', 'water'],
  },
  imageUrl: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: 'reported',
    enum: ['reported', 'in_progress', 'resolved'],
  },
  // GeoJSON Point format
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // Stored as [longitude, latitude]
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// CRITICAL: 2dsphere index enables spatial queries ($near, $geoWithin)
issueSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Issue', issueSchema);