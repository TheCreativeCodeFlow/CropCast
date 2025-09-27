const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's recent activities summary
    // This would typically aggregate data from other collections
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        farmDetails: user.farmDetails,
        location: user.location,
        preferences: user.preferences
      },
      stats: {
        totalPredictions: 0,
        totalDetections: 0,
        totalSoilTests: 0,
        accuracy: 0
      },
      recentActivities: [],
      recommendations: []
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { language, notifications } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'preferences.language': language,
          'preferences.notifications': notifications
        }
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { preferences: user.preferences }
    });

  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
});

// Update farm details
router.put('/farm-details', auth, async (req, res) => {
  try {
    const { totalArea, crops, soilType } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'farmDetails.totalArea': totalArea,
          'farmDetails.crops': crops,
          'farmDetails.soilType': soilType
        }
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Farm details updated successfully',
      data: { farmDetails: user.farmDetails }
    });

  } catch (error) {
    console.error('Farm details update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update farm details',
      error: error.message
    });
  }
});

// Get user activity feed
router.get('/activity-feed', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // This would typically aggregate activities from multiple collections
    // For now, returning mock data structure
    const activities = [
      {
        type: 'yield_prediction',
        title: 'Yield Prediction Created',
        description: 'Created prediction for Wheat crop',
        timestamp: new Date(),
        data: { cropType: 'wheat', predictedYield: 25.5 }
      },
      {
        type: 'pest_detection',
        title: 'Pest Detection Completed',
        description: 'Detected Aphids with 85% confidence',
        timestamp: new Date(Date.now() - 86400000),
        data: { pestName: 'Aphids', confidence: 85 }
      }
    ];

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          current: parseInt(page),
          total: 1,
          hasNext: false,
          hasPrev: false
        }
      }
    });

  } catch (error) {
    console.error('Activity feed fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity feed',
      error: error.message
    });
  }
});

// Get user statistics
router.get('/statistics', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days

    // This would typically aggregate data from other collections
    const statistics = {
      predictions: {
        total: 0,
        completed: 0,
        accuracy: 0
      },
      detections: {
        total: 0,
        pests: [],
        accuracy: 0
      },
      soilTests: {
        total: 0,
        avgHealthScore: 0,
        improvements: 0
      },
      farmingTips: {
        received: 0,
        implemented: 0
      }
    };

    res.json({
      success: true,
      data: statistics
    });

  } catch (error) {
    console.error('Statistics fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// Update user location
router.put('/location', auth, async (req, res) => {
  try {
    const { state, district, coordinates } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'location.state': state,
          'location.district': district,
          'location.coordinates': coordinates
        }
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: { location: user.location }
    });

  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: error.message
    });
  }
});

module.exports = router;