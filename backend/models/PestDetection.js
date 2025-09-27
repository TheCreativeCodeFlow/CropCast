const mongoose = require('mongoose');

const pestDetectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  cropType: {
    type: String,
    required: true
  },
  detectionResults: {
    pestName: String,
    pestNameHi: String,
    confidence: Number,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    symptoms: String,
    symptomsHi: String,
    treatment: String,
    treatmentHi: String,
    affectedCrops: [String],
    affectedCropsHi: [String]
  },
  location: {
    coordinates: {
      lat: Number,
      lng: Number
    },
    address: String
  },
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'failed'],
    default: 'pending'
  },
  expertReview: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewDate: Date,
    comments: String,
    verified: Boolean
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
pestDetectionSchema.index({ user: 1, createdAt: -1 });
pestDetectionSchema.index({ cropType: 1 });
pestDetectionSchema.index({ 'detectionResults.pestName': 1 });

module.exports = mongoose.model('PestDetection', pestDetectionSchema);