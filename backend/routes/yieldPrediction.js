const express = require('express');
const YieldPrediction = require('../models/YieldPrediction');
const auth = require('../middleware/auth');
const { predictYield } = require('../services/aiService');
const router = express.Router();

// Create yield prediction
router.post('/predict', auth, async (req, res) => {
  try {
    const {
      soilType,
      cropType,
      area,
      expectedRainfall,
      averageTemperature,
      previousYield,
      fertilizers,
      irrigationType,
      location,
      season
    } = req.body;

    // Validate required fields
    if (!soilType || !cropType || !area || !expectedRainfall || !averageTemperature) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: soilType, cropType, area, expectedRainfall, averageTemperature'
      });
    }

    // Create initial prediction record
    const yieldPrediction = new YieldPrediction({
      user: req.user.id,
      inputData: {
        soilType,
        cropType,
        area: parseFloat(area),
        expectedRainfall: parseFloat(expectedRainfall),
        averageTemperature: parseFloat(averageTemperature),
        previousYield: previousYield ? parseFloat(previousYield) : undefined,
        fertilizers,
        irrigationType
      },
      location,
      season,
      year: new Date().getFullYear(),
      status: 'pending'
    });

    await yieldPrediction.save();

    try {
      // Generate AI prediction
      const prediction = await predictYield({
        soilType,
        cropType,
        area,
        expectedRainfall,
        averageTemperature,
        previousYield,
        fertilizers,
        irrigationType
      });

      // Update with prediction results
      yieldPrediction.prediction = prediction;
      yieldPrediction.status = 'predicted';
      
      await yieldPrediction.save();

      res.json({
        success: true,
        message: 'Yield prediction completed successfully',
        data: yieldPrediction
      });

    } catch (aiError) {
      console.error('AI prediction error:', aiError);
      
      // Generate mock prediction
      const mockPrediction = generateMockYieldPrediction({
        soilType,
        cropType,
        area,
        expectedRainfall,
        averageTemperature
      });

      yieldPrediction.prediction = mockPrediction;
      yieldPrediction.status = 'predicted';
      await yieldPrediction.save();

      res.json({
        success: true,
        message: 'Yield prediction completed (using mock data)',
        data: yieldPrediction
      });
    }

  } catch (error) {
    console.error('Yield prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create yield prediction',
      error: error.message
    });
  }
});

// Get user's yield prediction history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, cropType, season, year, status } = req.query;

    const query = { user: req.user.id };
    
    if (cropType) {
      query['inputData.cropType'] = cropType;
    }
    
    if (season) {
      query.season = season;
    }
    
    if (year) {
      query.year = parseInt(year);
    }
    
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [predictions, total] = await Promise.all([
      YieldPrediction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      YieldPrediction.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        predictions,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          hasNext: skip + predictions.length < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Yield prediction history fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch yield prediction history',
      error: error.message
    });
  }
});

// Get specific yield prediction by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const yieldPrediction = await YieldPrediction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!yieldPrediction) {
      return res.status(404).json({
        success: false,
        message: 'Yield prediction not found'
      });
    }

    res.json({
      success: true,
      data: yieldPrediction
    });

  } catch (error) {
    console.error('Yield prediction fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch yield prediction',
      error: error.message
    });
  }
});

// Update actual yield (after harvest)
router.put('/:id/actual-yield', auth, async (req, res) => {
  try {
    const { yieldPerAcre, totalProduction } = req.body;

    if (!yieldPerAcre || !totalProduction) {
      return res.status(400).json({
        success: false,
        message: 'Both yieldPerAcre and totalProduction are required'
      });
    }

    const yieldPrediction = await YieldPrediction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!yieldPrediction) {
      return res.status(404).json({
        success: false,
        message: 'Yield prediction not found'
      });
    }

    // Update actual yield
    yieldPrediction.actualYield = {
      yieldPerAcre: parseFloat(yieldPerAcre),
      totalProduction: parseFloat(totalProduction),
      reportedBy: req.user.id,
      reportedAt: new Date()
    };

    // Calculate accuracy
    if (yieldPrediction.prediction && yieldPrediction.prediction.yieldPerAcre) {
      const predicted = yieldPrediction.prediction.yieldPerAcre;
      const actual = parseFloat(yieldPerAcre);
      const accuracy = 100 - Math.abs((predicted - actual) / actual) * 100;
      yieldPrediction.accuracy = Math.max(0, accuracy); // Ensure non-negative
    }

    yieldPrediction.status = 'completed';
    await yieldPrediction.save();

    res.json({
      success: true,
      message: 'Actual yield updated successfully',
      data: yieldPrediction
    });

  } catch (error) {
    console.error('Actual yield update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update actual yield',
      error: error.message
    });
  }
});

// Get yield statistics and insights
router.get('/stats/insights', auth, async (req, res) => {
  try {
    const { period = '365' } = req.query; // days
    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

    const stats = await YieldPrediction.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: startDate },
          status: { $in: ['predicted', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          totalPredictions: { $sum: 1 },
          completedPredictions: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          avgPredictedYield: { $avg: '$prediction.yieldPerAcre' },
          avgActualYield: { $avg: '$actualYield.yieldPerAcre' },
          avgAccuracy: { $avg: '$accuracy' },
          totalArea: { $sum: '$inputData.area' },
          cropTypes: { $addToSet: '$inputData.cropType' }
        }
      }
    ]);

    // Get crop-wise analysis
    const cropAnalysis = await YieldPrediction.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: startDate },
          status: { $in: ['predicted', 'completed'] }
        }
      },
      {
        $group: {
          _id: '$inputData.cropType',
          count: { $sum: 1 },
          avgPredictedYield: { $avg: '$prediction.yieldPerAcre' },
          avgActualYield: { $avg: '$actualYield.yieldPerAcre' },
          avgAccuracy: { $avg: '$accuracy' },
          totalArea: { $sum: '$inputData.area' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get seasonal analysis
    const seasonalAnalysis = await YieldPrediction.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: startDate },
          status: { $in: ['predicted', 'completed'] }
        }
      },
      {
        $group: {
          _id: '$season',
          count: { $sum: 1 },
          avgPredictedYield: { $avg: '$prediction.yieldPerAcre' },
          avgActualYield: { $avg: '$actualYield.yieldPerAcre' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalPredictions: 0,
          completedPredictions: 0,
          avgPredictedYield: 0,
          avgActualYield: 0,
          avgAccuracy: 0,
          totalArea: 0,
          cropTypes: []
        },
        cropAnalysis,
        seasonalAnalysis
      }
    });

  } catch (error) {
    console.error('Yield stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch yield statistics',
      error: error.message
    });
  }
});

// Get prediction benchmarks (average yields by crop and region)
router.get('/benchmarks', async (req, res) => {
  try {
    const { cropType, soilType, state } = req.query;

    const matchConditions = {
      status: 'completed',
      'actualYield.yieldPerAcre': { $exists: true }
    };

    if (cropType) {
      matchConditions['inputData.cropType'] = cropType;
    }

    if (soilType) {
      matchConditions['inputData.soilType'] = soilType;
    }

    if (state) {
      matchConditions['location.address'] = { $regex: state, $options: 'i' };
    }

    const benchmarks = await YieldPrediction.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: {
            cropType: '$inputData.cropType',
            soilType: '$inputData.soilType'
          },
          avgActualYield: { $avg: '$actualYield.yieldPerAcre' },
          minYield: { $min: '$actualYield.yieldPerAcre' },
          maxYield: { $max: '$actualYield.yieldPerAcre' },
          count: { $sum: 1 },
          avgAccuracy: { $avg: '$accuracy' }
        }
      },
      { $sort: { avgActualYield: -1 } }
    ]);

    res.json({
      success: true,
      data: benchmarks
    });

  } catch (error) {
    console.error('Benchmarks fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch yield benchmarks',
      error: error.message
    });
  }
});

// Helper function to generate mock yield prediction
function generateMockYieldPrediction(inputData) {
  const { soilType, cropType, area, expectedRainfall, averageTemperature } = inputData;

  // Base yields by crop type (quintals per acre)
  const baseYields = {
    wheat: 25,
    rice: 30,
    cotton: 15,
    sugarcane: 400,
    maize: 28
  };

  let baseYield = baseYields[cropType] || 20;

  // Adjust based on soil type
  const soilMultipliers = {
    alluvial: 1.1,
    black: 1.05,
    red: 0.95,
    sandy: 0.85,
    clay: 0.9,
    loamy: 1.15
  };

  baseYield *= soilMultipliers[soilType] || 1;

  // Adjust based on rainfall
  if (expectedRainfall < 400) {
    baseYield *= 0.8;
  } else if (expectedRainfall > 1000) {
    baseYield *= 0.9;
  }

  // Adjust based on temperature
  if (averageTemperature < 20 || averageTemperature > 35) {
    baseYield *= 0.9;
  }

  // Add some randomness
  const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
  const finalYield = baseYield * randomFactor;

  const confidence = Math.random() * 20 + 75; // 75-95%
  const totalProduction = finalYield * area;
  const estimatedPrice = getEstimatedPrice(cropType);
  const estimatedRevenue = totalProduction * estimatedPrice;

  return {
    yieldPerAcre: parseFloat(finalYield.toFixed(1)),
    totalProduction: parseFloat(totalProduction.toFixed(1)),
    confidence: parseFloat(confidence.toFixed(1)),
    factors: {
      soil: Math.random() * 20 + 80,
      weather: Math.random() * 30 + 70,
      crop: Math.random() * 15 + 85,
      management: Math.random() * 25 + 75
    },
    estimatedRevenue: parseFloat(estimatedRevenue.toFixed(0)),
    recommendations: [
      'Monitor soil moisture regularly',
      'Apply fertilizers as per schedule',
      'Watch for pest and disease symptoms'
    ],
    recommendationsHi: [
      'मिट्टी की नमी की नियमित निगरानी करें',
      'समय पर उर्वरक डालें',
      'कीट और रोग के लक्षणों पर नजर रखें'
    ]
  };
}

// Helper function to get estimated market price
function getEstimatedPrice(cropType) {
  const prices = {
    wheat: 2850,
    rice: 3200,
    cotton: 6800,
    sugarcane: 380,
    maize: 2400
  };

  return prices[cropType] || 2000;
}

module.exports = router;