const mongoose = require('mongoose');

const yieldPredictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inputData: {
    soilType: {
      type: String,
      required: true,
      enum: ['alluvial', 'black', 'red', 'sandy', 'clay', 'loamy']
    },
    cropType: {
      type: String,
      required: true
    },
    area: {
      type: Number,
      required: true
    }, // in acres
    expectedRainfall: {
      type: Number,
      required: true
    }, // in mm
    averageTemperature: {
      type: Number,
      required: true
    }, // in celsius
    previousYield: Number, // optional, for better predictions
    fertilizers: [{
      type: String,
      quantity: Number
    }],
    irrigationType: {
      type: String,
      enum: ['drip', 'sprinkler', 'flood', 'rain-fed']
    }
  },
  prediction: {
    yieldPerAcre: Number, // quintals per acre
    totalProduction: Number, // total quintals
    confidence: Number, // percentage
    factors: {
      soil: Number,
      weather: Number,
      crop: Number,
      management: Number
    },
    estimatedRevenue: Number,
    recommendations: [String],
    recommendationsHi: [String]
  },
  actualYield: {
    yieldPerAcre: Number,
    totalProduction: Number,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reportedAt: Date
  },
  accuracy: Number, // calculated after actual yield is reported
  location: {
    coordinates: {
      lat: Number,
      lng: Number
    },
    address: String
  },
  season: {
    type: String,
    enum: ['kharif', 'rabi', 'zaid']
  },
  year: {
    type: Number,
    default: new Date().getFullYear()
  },
  status: {
    type: String,
    enum: ['pending', 'predicted', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
yieldPredictionSchema.index({ user: 1, createdAt: -1 });
yieldPredictionSchema.index({ 'inputData.cropType': 1, 'inputData.soilType': 1 });
yieldPredictionSchema.index({ season: 1, year: 1 });

module.exports = mongoose.model('YieldPrediction', yieldPredictionSchema);