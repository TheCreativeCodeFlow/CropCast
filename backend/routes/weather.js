const express = require('express');
const WeatherData = require('../models/WeatherData');
const auth = require('../middleware/auth');
const { getWeatherFromAPI, generateFarmingRecommendations } = require('../services/weatherService');
const router = express.Router();

// Get current weather and forecast
router.get('/current', async (req, res) => {
  try {
    const { lat, lng, city, state } = req.query;

    // Check if we have recent weather data
    let weatherData = await WeatherData.findOne({
      $or: [
        { 'location.coordinates.lat': lat, 'location.coordinates.lng': lng },
        { 'location.city': city, 'location.state': state }
      ],
      createdAt: { $gte: new Date(Date.now() - 3600000) } // 1 hour old
    }).sort({ createdAt: -1 });

    if (!weatherData) {
      // Fetch fresh weather data
      const freshWeatherData = await getWeatherFromAPI(lat, lng, city, state);
      
      // Generate farming recommendations based on weather
      const farmingRecommendations = generateFarmingRecommendations(freshWeatherData);
      
      weatherData = new WeatherData({
        location: {
          coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
          city,
          state
        },
        current: freshWeatherData.current,
        forecast: freshWeatherData.forecast,
        alerts: freshWeatherData.alerts,
        farmingRecommendations,
        dataSource: {
          provider: 'OpenWeatherMap',
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 3600000) // 1 hour later
        }
      });

      await weatherData.save();
    }

    res.json({
      success: true,
      data: weatherData
    });

  } catch (error) {
    console.error('Weather fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message
    });
  }
});

// Get weather alerts for a location
router.get('/alerts', async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query; // radius in km

    const alerts = await WeatherData.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: 'distance',
          maxDistance: radius * 1000, // convert to meters
          spherical: true
        }
      },
      {
        $unwind: '$alerts'
      },
      {
        $match: {
          'alerts.isActive': true,
          'alerts.validTo': { $gte: new Date() }
        }
      },
      {
        $project: {
          alert: '$alerts',
          location: '$location',
          distance: 1
        }
      },
      {
        $sort: { 'alert.severity': 1, distance: 1 }
      }
    ]);

    res.json({
      success: true,
      data: alerts
    });

  } catch (error) {
    console.error('Weather alerts fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather alerts',
      error: error.message
    });
  }
});

// Get farming recommendations based on weather
router.get('/recommendations', auth, async (req, res) => {
  try {
    const { lat, lng, cropType } = req.query;

    const weatherData = await WeatherData.findOne({
      'location.coordinates.lat': { $near: parseFloat(lat) },
      'location.coordinates.lng': { $near: parseFloat(lng) }
    }).sort({ createdAt: -1 });

    if (!weatherData) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not found for this location'
      });
    }

    // Filter recommendations based on crop type if provided
    let recommendations = weatherData.farmingRecommendations;
    
    if (cropType) {
      recommendations = recommendations.filter(rec => 
        !rec.validFor.crops.length || 
        rec.validFor.crops.includes(cropType) ||
        rec.validFor.cropsHi.includes(cropType)
      );
    }

    res.json({
      success: true,
      data: {
        weather: weatherData.current,
        recommendations
      }
    });

  } catch (error) {
    console.error('Weather recommendations fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather recommendations',
      error: error.message
    });
  }
});

// Get historical weather data
router.get('/history', auth, async (req, res) => {
  try {
    const { lat, lng, startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const historicalData = await WeatherData.find({
      'location.coordinates.lat': { $near: parseFloat(lat) },
      'location.coordinates.lng': { $near: parseFloat(lng) },
      createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      data: historicalData
    });

  } catch (error) {
    console.error('Historical weather fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch historical weather data',
      error: error.message
    });
  }
});

module.exports = router;