const express = require('express');
const SoilTest = require('../models/SoilTest');
const auth = require('../middleware/auth');
const { analyzeSoilHealth, generateSoilRecommendations } = require('../services/soilService');
const router = express.Router();

// Create soil test record
router.post('/test', auth, async (req, res) => {
  try {
    const {
      location,
      soilType,
      testResults,
      testMethod,
      laboratoryDetails
    } = req.body;

    // Validate required fields
    if (!testResults || !testResults.ph || !testResults.nitrogen) {
      return res.status(400).json({
        success: false,
        message: 'Basic test results (pH, nitrogen) are required'
      });
    }

    // Analyze soil health
    const analysisResults = analyzeSoilHealth(testResults);
    
    // Generate recommendations
    const recommendations = generateSoilRecommendations(testResults, soilType);

    // Create soil test record
    const soilTest = new SoilTest({
      user: req.user.id,
      location,
      soilType,
      testResults: analysisResults.testResults,
      recommendations,
      testMethod: testMethod || 'digital-sensor',
      laboratoryDetails,
      overallHealth: analysisResults.overallHealth
    });

    await soilTest.save();

    res.json({
      success: true,
      message: 'Soil test results saved successfully',
      data: soilTest
    });

  } catch (error) {
    console.error('Soil test creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create soil test record',
      error: error.message
    });
  }
});

// Get user's soil test history
router.get('/tests', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, soilType, location } = req.query;

    const query = { user: req.user.id };
    
    if (soilType) {
      query.soilType = soilType;
    }
    
    if (location) {
      query['location.fieldName'] = { $regex: location, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [tests, total] = await Promise.all([
      SoilTest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      SoilTest.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        tests,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          hasNext: skip + tests.length < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Soil tests fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch soil tests',
      error: error.message
    });
  }
});

// Get specific soil test by ID
router.get('/tests/:id', auth, async (req, res) => {
  try {
    const soilTest = await SoilTest.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!soilTest) {
      return res.status(404).json({
        success: false,
        message: 'Soil test not found'
      });
    }

    res.json({
      success: true,
      data: soilTest
    });

  } catch (error) {
    console.error('Soil test fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch soil test',
      error: error.message
    });
  }
});

// Get fertilizer recommendations for specific crop
router.get('/fertilizer-guide/:cropType', async (req, res) => {
  try {
    const { cropType } = req.params;
    const { soilType } = req.query;

    const fertilizerGuide = getFertilizerGuide(cropType, soilType);

    res.json({
      success: true,
      data: fertilizerGuide
    });

  } catch (error) {
    console.error('Fertilizer guide fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fertilizer guide',
      error: error.message
    });
  }
});

// Get soil health analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const { period = '365' } = req.query; // days
    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

    const analytics = await SoilTest.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalTests: { $sum: 1 },
          avgPh: { $avg: '$testResults.ph.value' },
          avgNitrogen: { $avg: '$testResults.nitrogen.value' },
          avgPhosphorus: { $avg: '$testResults.phosphorus.value' },
          avgPotassium: { $avg: '$testResults.potassium.value' },
          avgOrganicMatter: { $avg: '$testResults.organicMatter.value' },
          avgHealthScore: { $avg: '$overallHealth.score' },
          soilTypes: { $addToSet: '$soilType' }
        }
      }
    ]);

    // Get trends over time
    const trends = await SoilTest.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          avgHealthScore: { $avg: '$overallHealth.score' },
          avgPh: { $avg: '$testResults.ph.value' },
          testCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get soil type distribution
    const soilTypeDistribution = await SoilTest.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$soilType',
          count: { $sum: 1 },
          avgHealthScore: { $avg: '$overallHealth.score' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: analytics[0] || {
          totalTests: 0,
          avgPh: 0,
          avgNitrogen: 0,
          avgPhosphorus: 0,
          avgPotassium: 0,
          avgOrganicMatter: 0,
          avgHealthScore: 0,
          soilTypes: []
        },
        trends,
        soilTypeDistribution
      }
    });

  } catch (error) {
    console.error('Soil analytics fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch soil analytics',
      error: error.message
    });
  }
});

// Get soil improvement tracking
router.get('/improvement-tracking', auth, async (req, res) => {
  try {
    const { fieldName } = req.query;

    const query = { user: req.user.id };
    if (fieldName) {
      query['location.fieldName'] = fieldName;
    }

    const soilTests = await SoilTest.find(query)
      .sort({ createdAt: 1 })
      .select('testResults.ph.value testResults.nitrogen.value testResults.phosphorus.value testResults.potassium.value overallHealth.score createdAt location.fieldName');

    // Group by field and calculate improvement
    const improvement = {};
    
    soilTests.forEach(test => {
      const field = test.location?.fieldName || 'default';
      if (!improvement[field]) {
        improvement[field] = [];
      }
      improvement[field].push({
        date: test.createdAt,
        ph: test.testResults.ph?.value,
        nitrogen: test.testResults.nitrogen?.value,
        phosphorus: test.testResults.phosphorus?.value,
        potassium: test.testResults.potassium?.value,
        healthScore: test.overallHealth?.score
      });
    });

    res.json({
      success: true,
      data: improvement
    });

  } catch (error) {
    console.error('Soil improvement tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch soil improvement tracking',
      error: error.message
    });
  }
});

// Get mock soil data for demo
router.get('/mock-data', auth, async (req, res) => {
  try {
    const mockSoilData = {
      ph: 6.8,
      nitrogen: 75,
      phosphorus: 45,
      potassium: 60,
      organicMatter: 3.2,
      moisture: 55
    };

    const analysisResults = analyzeSoilHealth(mockSoilData);
    const recommendations = generateSoilRecommendations(mockSoilData, 'alluvial');

    res.json({
      success: true,
      data: {
        testResults: analysisResults.testResults,
        overallHealth: analysisResults.overallHealth,
        recommendations
      }
    });

  } catch (error) {
    console.error('Mock soil data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate mock soil data',
      error: error.message
    });
  }
});

// Helper function to get fertilizer guide
function getFertilizerGuide(cropType, soilType) {
  const crops = {
    wheat: {
      id: 'wheat',
      name: 'Wheat',
      nameHi: 'गेहूं',
      icon: '🌾',
      idealPh: '6.0-7.5',
      npkRatio: '4:2:1',
      fertilizers: [
        { name: 'Urea', nameHi: 'यूरिया', amount: '120 kg/acre', timing: 'Pre-sowing + 30 days' },
        { name: 'DAP', nameHi: 'डीएपी', amount: '50 kg/acre', timing: 'At sowing' },
        { name: 'MOP', nameHi: 'एमओपी', amount: '25 kg/acre', timing: 'At sowing' }
      ],
      tips: [
        'Apply nitrogen in split doses',
        'Ensure adequate drainage',
        'Monitor for iron deficiency'
      ],
      tipsHi: [
        'नाइट्रोजन को भागों में दें',
        'उचित जल निकासी सुनिश्चित करें',
        'आयरन की कमी की निगरानी करें'
      ]
    },
    rice: {
      id: 'rice',
      name: 'Rice',
      nameHi: 'चावल',
      icon: '🌾',
      idealPh: '5.5-6.5',
      npkRatio: '3:1:2',
      fertilizers: [
        { name: 'Urea', nameHi: 'यूरिया', amount: '100 kg/acre', timing: 'Split application' },
        { name: 'SSP', nameHi: 'एसएसपी', amount: '75 kg/acre', timing: 'Before transplanting' },
        { name: 'MOP', nameHi: 'एमओपी', amount: '35 kg/acre', timing: 'At transplanting' }
      ],
      tips: [
        'Maintain 2-3 cm water level',
        'Apply zinc sulfate if needed',
        'Use organic matter regularly'
      ],
      tipsHi: [
        '2-3 सेमी पानी का स्तर बनाए रखें',
        'जरूरत पड़ने पर जिंक सल्फेट दें',
        'नियमित रूप से जैविक खाद का उपयोग करें'
      ]
    },
    cotton: {
      id: 'cotton',
      name: 'Cotton',
      nameHi: 'कपास',
      icon: '🌱',
      idealPh: '6.0-8.0',
      npkRatio: '6:3:3',
      fertilizers: [
        { name: 'Urea', nameHi: 'यूरिया', amount: '150 kg/acre', timing: 'Split in 3 doses' },
        { name: 'DAP', nameHi: 'डीएपी', amount: '75 kg/acre', timing: 'At sowing' },
        { name: 'MOP', nameHi: 'एमओपी', amount: '50 kg/acre', timing: 'At flowering' }
      ],
      tips: [
        'Deep plowing recommended',
        'Apply boron for better yields',
        'Monitor soil salinity'
      ],
      tipsHi: [
        'गहरी जुताई की सिफारिश',
        'बेहतर उपज के लिए बोरॉन दें',
        'मिट्टी की लवणता की निगरानी करें'
      ]
    }
  };

  return crops[cropType] || crops.wheat;
}

module.exports = router;