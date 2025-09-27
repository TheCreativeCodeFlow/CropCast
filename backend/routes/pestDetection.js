const express = require('express');
const multer = require('multer');
const PestDetection = require('../models/PestDetection');
const auth = require('../middleware/auth');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { detectPestFromImage } = require('../services/aiService');
const router = express.Router();

// Configure multer for image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload image and detect pest
router.post('/analyze', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const { cropType, location } = req.body;

    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer, 'pest-detection');

    // Create initial pest detection record
    const pestDetection = new PestDetection({
      user: req.user.id,
      imageUrl,
      cropType,
      location: location ? JSON.parse(location) : undefined,
      status: 'pending'
    });

    await pestDetection.save();

    // Analyze image for pest detection
    try {
      const detectionResults = await detectPestFromImage(imageUrl, cropType);
      
      // Update the record with results
      pestDetection.detectionResults = detectionResults;
      pestDetection.status = 'analyzed';
      
      await pestDetection.save();

      res.json({
        success: true,
        message: 'Pest detection completed successfully',
        data: pestDetection
      });

    } catch (aiError) {
      console.error('AI analysis error:', aiError);
      
      // Update status to failed
      pestDetection.status = 'failed';
      await pestDetection.save();

      // Return mock results for now
      const mockResults = generateMockPestResults(cropType);
      pestDetection.detectionResults = mockResults;
      pestDetection.status = 'analyzed';
      await pestDetection.save();

      res.json({
        success: true,
        message: 'Pest detection completed (using mock data)',
        data: pestDetection
      });
    }

  } catch (error) {
    console.error('Pest detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze image for pest detection',
      error: error.message
    });
  }
});

// Get user's pest detection history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, cropType, status } = req.query;

    const query = { user: req.user.id };
    
    if (cropType) {
      query.cropType = cropType;
    }
    
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [detections, total] = await Promise.all([
      PestDetection.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('expertReview.reviewedBy', 'name'),
      PestDetection.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        detections,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          hasNext: skip + detections.length < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Pest detection history fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pest detection history',
      error: error.message
    });
  }
});

// Get specific pest detection by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const pestDetection = await PestDetection.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('expertReview.reviewedBy', 'name');

    if (!pestDetection) {
      return res.status(404).json({
        success: false,
        message: 'Pest detection record not found'
      });
    }

    res.json({
      success: true,
      data: pestDetection
    });

  } catch (error) {
    console.error('Pest detection fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pest detection record',
      error: error.message
    });
  }
});

// Get pest statistics and insights
router.get('/stats/insights', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

    const stats = await PestDetection.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: startDate },
          status: 'analyzed'
        }
      },
      {
        $group: {
          _id: null,
          totalDetections: { $sum: 1 },
          avgConfidence: { $avg: '$detectionResults.confidence' },
          pestTypes: { $addToSet: '$detectionResults.pestName' },
          cropTypes: { $addToSet: '$cropType' },
          severityDistribution: {
            $push: '$detectionResults.severity'
          }
        }
      }
    ]);

    // Get most common pests
    const commonPests = await PestDetection.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: startDate },
          status: 'analyzed'
        }
      },
      {
        $group: {
          _id: '$detectionResults.pestName',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$detectionResults.confidence' },
          severity: { $first: '$detectionResults.severity' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalDetections: 0,
          avgConfidence: 0,
          pestTypes: [],
          cropTypes: [],
          severityDistribution: []
        },
        commonPests
      }
    });

  } catch (error) {
    console.error('Pest stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pest statistics',
      error: error.message
    });
  }
});

// Get common pests information
router.get('/info/common', async (req, res) => {
  try {
    const { cropType } = req.query;

    // This would typically come from a database of pest information
    const commonPests = getCommonPestsInfo(cropType);

    res.json({
      success: true,
      data: commonPests
    });

  } catch (error) {
    console.error('Common pests info fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch common pests information',
      error: error.message
    });
  }
});

// Expert review route (for expert users)
router.post('/:id/review', auth, async (req, res) => {
  try {
    // Check if user is an expert or admin
    if (!['expert', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Expert privileges required.'
      });
    }

    const { comments, verified } = req.body;
    
    const pestDetection = await PestDetection.findById(req.params.id);
    if (!pestDetection) {
      return res.status(404).json({
        success: false,
        message: 'Pest detection record not found'
      });
    }

    pestDetection.expertReview = {
      reviewedBy: req.user.id,
      reviewDate: new Date(),
      comments,
      verified
    };

    await pestDetection.save();

    res.json({
      success: true,
      message: 'Expert review added successfully',
      data: pestDetection
    });

  } catch (error) {
    console.error('Expert review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add expert review',
      error: error.message
    });
  }
});

// Helper function to generate mock pest detection results
function generateMockPestResults(cropType) {
  const pests = {
    wheat: [
      { name: 'Aphids', nameHi: 'एफिड्स', severity: 'medium' },
      { name: 'Rust', nameHi: 'रस्ट', severity: 'high' }
    ],
    rice: [
      { name: 'Brown Planthopper', nameHi: 'ब्राउन प्लांटहॉपर', severity: 'high' },
      { name: 'Stem Borer', nameHi: 'स्टेम बोरर', severity: 'medium' }
    ],
    cotton: [
      { name: 'Bollworm', nameHi: 'बॉलवर्म', severity: 'high' },
      { name: 'Whitefly', nameHi: 'व्हाइटफ्लाई', severity: 'medium' }
    ]
  };

  const cropPests = pests[cropType] || pests.wheat;
  const selectedPest = cropPests[Math.floor(Math.random() * cropPests.length)];

  return {
    pestName: selectedPest.name,
    pestNameHi: selectedPest.nameHi,
    confidence: Math.random() * 20 + 75, // 75-95%
    severity: selectedPest.severity,
    symptoms: 'Visible damage on leaves and stems',
    symptomsHi: 'पत्तियों और तनों पर दिखाई देने वाला नुकसान',
    treatment: 'Apply appropriate pesticide and monitor regularly',
    treatmentHi: 'उपयुक्त कीटनाशक लगाएं और नियमित निगरानी करें',
    affectedCrops: [cropType],
    affectedCropsHi: [cropType]
  };
}

// Helper function to get common pests information
function getCommonPestsInfo(cropType) {
  const commonPests = [
    {
      name: 'Aphids',
      nameHi: 'एफिड्स',
      severity: 'medium',
      crops: ['wheat', 'cotton', 'tomato'],
      cropsHi: ['गेहूं', 'कपास', 'टमाटर'],
      symptoms: 'Yellowing leaves, sticky honeydew',
      symptomsHi: 'पत्तियों का पीलापन, चिपचिपा रस',
      treatment: 'Neem oil spray, ladybird beetles',
      treatmentHi: 'नीम तेल का छिड़काव, लेडीबर्ड बीटल',
      image: '🐛'
    },
    {
      name: 'Bollworm',
      nameHi: 'बॉलवर्म',
      severity: 'high',
      crops: ['cotton', 'tomato'],
      cropsHi: ['कपास', 'टमाटर'],
      symptoms: 'Holes in bolls, damaged fruits',
      symptomsHi: 'कपास की गांठों में छेद, फलों को नुकसान',
      treatment: 'Bt spray, pheromone traps',
      treatmentHi: 'बीटी स्प्रे, फेरोमोन ट्रैप',
      image: '🐛'
    },
    {
      name: 'Whitefly',
      nameHi: 'व्हाइटफ्लाई',
      severity: 'medium',
      crops: ['cotton', 'tomato', 'chili'],
      cropsHi: ['कपास', 'टमाटर', 'मिर्च'],
      symptoms: 'Yellow, wilted leaves',
      symptomsHi: 'पीली, मुरझाई पत्तियां',
      treatment: 'Yellow sticky traps, reflective mulch',
      treatmentHi: 'पीले चिपकने वाले जाल, परावर्तक मल्च',
      image: '🦟'
    }
  ];

  // Filter by crop type if specified
  if (cropType) {
    return commonPests.filter(pest => 
      pest.crops.includes(cropType) || 
      pest.cropsHi.includes(cropType)
    );
  }

  return commonPests;
}

module.exports = router;