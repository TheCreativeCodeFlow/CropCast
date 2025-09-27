const Joi = require('joi');

// Registration validation
const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^\d{10}$/).optional(),
    location: Joi.object({
      state: Joi.string().optional(),
      district: Joi.string().optional(),
      coordinates: Joi.object({
        lat: Joi.number().optional(),
        lng: Joi.number().optional()
      }).optional()
    }).optional(),
    farmDetails: Joi.object({
      totalArea: Joi.number().positive().optional(),
      crops: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        area: Joi.number().positive().required(),
        season: Joi.string().optional()
      })).optional(),
      soilType: Joi.string().valid('alluvial', 'black', 'red', 'sandy', 'clay', 'loamy').optional()
    }).optional(),
    preferences: Joi.object({
      language: Joi.string().valid('en', 'hi').default('en'),
      notifications: Joi.object({
        weather: Joi.boolean().default(true),
        market: Joi.boolean().default(true),
        pest: Joi.boolean().default(true)
      }).optional()
    }).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }

  next();
};

// Login validation
const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }

  next();
};

// Yield prediction validation
const validateYieldPrediction = (req, res, next) => {
  const schema = Joi.object({
    soilType: Joi.string().valid('alluvial', 'black', 'red', 'sandy', 'clay', 'loamy').required(),
    cropType: Joi.string().required(),
    area: Joi.number().positive().required(),
    expectedRainfall: Joi.number().positive().required(),
    averageTemperature: Joi.number().min(-10).max(50).required(),
    previousYield: Joi.number().positive().optional(),
    fertilizers: Joi.array().items(Joi.object({
      type: Joi.string().required(),
      quantity: Joi.number().positive().required()
    })).optional(),
    irrigationType: Joi.string().valid('drip', 'sprinkler', 'flood', 'rain-fed').optional(),
    location: Joi.object({
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required()
      }).optional(),
      address: Joi.string().optional()
    }).optional(),
    season: Joi.string().valid('kharif', 'rabi', 'zaid').optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }

  next();
};

// Soil test validation
const validateSoilTest = (req, res, next) => {
  const schema = Joi.object({
    location: Joi.object({
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90).optional(),
        lng: Joi.number().min(-180).max(180).optional()
      }).optional(),
      address: Joi.string().optional(),
      fieldName: Joi.string().optional()
    }).optional(),
    soilType: Joi.string().valid('alluvial', 'black', 'red', 'sandy', 'clay', 'loamy').optional(),
    testResults: Joi.object({
      ph: Joi.object({
        value: Joi.number().min(0).max(14).required()
      }).required(),
      nitrogen: Joi.object({
        value: Joi.number().min(0).required(),
        unit: Joi.string().default('%')
      }).required(),
      phosphorus: Joi.object({
        value: Joi.number().min(0).required(),
        unit: Joi.string().default('%')
      }).optional(),
      potassium: Joi.object({
        value: Joi.number().min(0).required(),
        unit: Joi.string().default('%')
      }).optional(),
      organicMatter: Joi.object({
        value: Joi.number().min(0).required(),
        unit: Joi.string().default('%')
      }).optional(),
      moisture: Joi.object({
        value: Joi.number().min(0).max(100).required(),
        unit: Joi.string().default('%')
      }).optional(),
      electricalConductivity: Joi.number().min(0).optional(),
      micronutrients: Joi.object({
        iron: Joi.number().min(0).optional(),
        zinc: Joi.number().min(0).optional(),
        manganese: Joi.number().min(0).optional(),
        copper: Joi.number().min(0).optional(),
        boron: Joi.number().min(0).optional()
      }).optional()
    }).required(),
    testMethod: Joi.string().valid('laboratory', 'digital-sensor', 'field-kit').default('digital-sensor'),
    laboratoryDetails: Joi.object({
      name: Joi.string().optional(),
      certificationNumber: Joi.string().optional(),
      testDate: Joi.date().optional()
    }).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }

  next();
};

// Query parameter validation for pagination
const validatePagination = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  });

  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid query parameters',
      errors: error.details.map(detail => detail.message)
    });
  }

  // Update query with validated values
  req.query = { ...req.query, ...value };
  next();
};

// Coordinates validation
const validateCoordinates = (req, res, next) => {
  const schema = Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    radius: Joi.number().min(1).max(1000).default(50) // km
  });

  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid coordinates',
      errors: error.details.map(detail => detail.message)
    });
  }

  req.query = { ...req.query, ...value };
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateYieldPrediction,
  validateSoilTest,
  validatePagination,
  validateCoordinates
};