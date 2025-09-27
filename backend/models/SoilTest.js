const mongoose = require('mongoose');

const soilTestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    coordinates: {
      lat: Number,
      lng: Number
    },
    address: String,
    fieldName: String
  },
  soilType: {
    type: String,
    enum: ['alluvial', 'black', 'red', 'sandy', 'clay', 'loamy']
  },
  testResults: {
    ph: {
      value: Number,
      status: {
        type: String,
        enum: ['good', 'needs-attention', 'critical']
      }
    },
    nitrogen: {
      value: Number,
      unit: String,
      status: {
        type: String,
        enum: ['good', 'needs-attention', 'critical']
      }
    },
    phosphorus: {
      value: Number,
      unit: String,
      status: {
        type: String,
        enum: ['good', 'needs-attention', 'critical']
      }
    },
    potassium: {
      value: Number,
      unit: String,
      status: {
        type: String,
        enum: ['good', 'needs-attention', 'critical']
      }
    },
    organicMatter: {
      value: Number,
      unit: String,
      status: {
        type: String,
        enum: ['good', 'needs-attention', 'critical']
      }
    },
    moisture: {
      value: Number,
      unit: String,
      status: {
        type: String,
        enum: ['good', 'needs-attention', 'critical']
      }
    },
    electricalConductivity: Number,
    micronutrients: {
      iron: Number,
      zinc: Number,
      manganese: Number,
      copper: Number,
      boron: Number
    }
  },
  recommendations: {
    immediate: [String],
    immediateHi: [String],
    longTerm: [String],
    longTermHi: [String],
    fertilizers: [{
      name: String,
      nameHi: String,
      quantity: String,
      timing: String,
      timingHi: String
    }],
    amendments: [{
      material: String,
      materialHi: String,
      quantity: String,
      purpose: String,
      purposeHi: String
    }]
  },
  testMethod: {
    type: String,
    enum: ['laboratory', 'digital-sensor', 'field-kit'],
    default: 'digital-sensor'
  },
  laboratoryDetails: {
    name: String,
    certificationNumber: String,
    testDate: Date
  },
  overallHealth: {
    score: Number, // 0-100
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'F']
    },
    status: String,
    statusHi: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
soilTestSchema.index({ user: 1, createdAt: -1 });
soilTestSchema.index({ 'location.coordinates': '2dsphere' });
soilTestSchema.index({ soilType: 1 });

module.exports = mongoose.model('SoilTest', soilTestSchema);