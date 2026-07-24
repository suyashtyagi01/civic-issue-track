// backend/routes/issueRoutes.js
const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');

// @route   POST /api/issues
// @desc    Create a new civic issue report
router.post('/', async (req, res) => {
  try {
    const { title, category, imageUrl, lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and Longitude are required.' });
    }

    const newIssue = await Issue.create({
      title,
      category,
      imageUrl,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)], // MongoDB expects [lng, lat]
      },
    });

    res.status(201).json({ success: true, data: newIssue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/issues/nearby
// @desc    Fetch issues within a radius (default 5000m / 5km)
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistanceMeters = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Current lat and lng query params are required.' });
    }

    const nearbyIssues = await Issue.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistanceMeters),
        },
      },
    });

    res.status(200).json({ success: true, count: nearbyIssues.length, data: nearbyIssues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;