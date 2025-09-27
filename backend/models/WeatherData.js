const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  location: {
    coordinates: {
      lat: Number,
      lng: Number
    },
    city: String,
    state: String,
    district: String
  },
  current: {
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    windDirection: String,
    pressure: Number,
    visibility: Number,
    uvIndex: Number,
    condition: String,
    conditionHi: String,
    rainChance: Number,
    sunrise: String,
    sunset: String
  },
  forecast: [{
    date: Date,
    day: String,
    dayHi: String,
    temperature: {
      max: Number,
      min: Number
    },
    condition: String,
    conditionHi: String,
    rainChance: Number,
    rainfall: Number,
    humidity: Number,
    windSpeed: Number
  }],
  alerts: [{
    type: {
      type: String,
      enum: ['weather', 'farming', 'pest', 'disease']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    title: String,
    titleHi: String,
    message: String,
    messageHi: String,
    validFrom: Date,
    validTo: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  farmingRecommendations: [{
    type: {
      type: String,
      enum: ['irrigation', 'spraying', 'harvesting', 'sowing', 'general']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    title: String,
    titleHi: String,
    description: String,
    descriptionHi: String,
    validFor: {
      crops: [String],
      cropsHi: [String]
    },
    timing: String,
    timingHi: String
  }],
  dataSource: {
    provider: String,
    lastUpdated: Date,
    nextUpdate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Document expires after 24 hours
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
weatherDataSchema.index({ 'location.coordinates': '2dsphere' });
weatherDataSchema.index({ 'location.city': 1, 'location.state': 1 });
weatherDataSchema.index({ createdAt: -1 });

module.exports = mongoose.model('WeatherData', weatherDataSchema);