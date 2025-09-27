const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  commodity: {
    name: String,
    nameHi: String,
    category: {
      type: String,
      enum: ['cereal', 'vegetable', 'fiber', 'cash', 'pulses', 'oilseed']
    }
  },
  market: {
    name: String,
    nameHi: String,
    state: String,
    district: String,
    type: {
      type: String,
      enum: ['APMC', 'mandi', 'wholesale', 'retail']
    }
  },
  price: {
    current: Number,
    previous: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    unit: {
      type: String,
      default: 'quintal'
    },
    unitHi: {
      type: String,
      default: 'क्विंटल'
    }
  },
  quality: {
    grade: String,
    gradeHi: String,
    specifications: String
  },
  trend: {
    direction: {
      type: String,
      enum: ['up', 'down', 'stable']
    },
    change: Number,
    changePercent: Number
  },
  forecast: {
    prediction: {
      type: String,
      enum: ['bullish', 'bearish', 'stable']
    },
    factors: [String],
    factorsHi: [String]
  },
  volume: {
    traded: Number,
    arrival: Number
  },
  source: {
    provider: String,
    reliability: Number
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
marketPriceSchema.index({ 'commodity.name': 1, 'market.name': 1 });
marketPriceSchema.index({ 'commodity.category': 1 });
marketPriceSchema.index({ lastUpdated: -1 });
marketPriceSchema.index({ 'market.state': 1, 'market.district': 1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);