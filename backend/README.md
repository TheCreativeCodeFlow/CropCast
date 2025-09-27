# CropCast Backend API

Backend server for the CropCast Agricultural Platform - an AI-powered farming assistant that provides crop advisory, yield prediction, pest detection, weather insights, and market prices.

## Features

- **User Authentication & Management**
- **Weather Data & Farming Alerts**
- **Pest Detection using AI**
- **Yield Prediction Analytics**
- **Soil Analysis & Recommendations**
- **Market Price Tracking**
- **Multi-language Support (English/Hindi)**

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer + Cloudinary
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### 1. Clone and Install

```bash
cd cropcast-agri-aid/backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/cropcast

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Keys
WEATHER_API_KEY=your-openweathermap-api-key
OPENAI_API_KEY=your-openai-api-key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# External APIs
MARKET_DATA_API_KEY=your-market-data-api-key
SOIL_API_KEY=your-soil-analysis-api-key
```

### 3. Database Setup

Make sure MongoDB is running on your system:

```bash
# On Windows (if MongoDB installed locally)
mongod

# Or use MongoDB Atlas cloud database
# Just update MONGODB_URI in .env file
```

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Weather
- `GET /api/weather/current` - Get current weather and forecast
- `GET /api/weather/alerts` - Get weather alerts for location
- `GET /api/weather/recommendations` - Get farming recommendations

### Pest Detection
- `POST /api/pest-detection/analyze` - Upload image for pest detection
- `GET /api/pest-detection/history` - Get user's detection history
- `GET /api/pest-detection/info/common` - Get common pests information

### Yield Prediction
- `POST /api/yield-prediction/predict` - Create yield prediction
- `GET /api/yield-prediction/history` - Get prediction history
- `PUT /api/yield-prediction/:id/actual-yield` - Update actual yield

### Soil Analysis
- `POST /api/soil/test` - Submit soil test results
- `GET /api/soil/tests` - Get soil test history
- `GET /api/soil/fertilizer-guide/:cropType` - Get fertilizer recommendations

### Market Prices
- `GET /api/market/prices` - Get current market prices
- `GET /api/market/trends/:commodityId` - Get price trends
- `GET /api/market/analysis` - Get market analysis and insights

### User Management
- `GET /api/user/dashboard` - Get dashboard data
- `PUT /api/user/preferences` - Update user preferences
- `PUT /api/user/farm-details` - Update farm details

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  location: {
    state: String,
    district: String,
    coordinates: { lat: Number, lng: Number }
  },
  farmDetails: {
    totalArea: Number,
    crops: [{ name: String, area: Number, season: String }],
    soilType: String
  },
  preferences: {
    language: String,
    notifications: Object
  }
}
```

### Pest Detection Model
```javascript
{
  user: ObjectId,
  imageUrl: String,
  cropType: String,
  detectionResults: {
    pestName: String,
    confidence: Number,
    severity: String,
    treatment: String
  },
  location: Object,
  createdAt: Date
}
```

### Yield Prediction Model
```javascript
{
  user: ObjectId,
  inputData: {
    soilType: String,
    cropType: String,
    area: Number,
    expectedRainfall: Number,
    averageTemperature: Number
  },
  prediction: {
    yieldPerAcre: Number,
    totalProduction: Number,
    confidence: Number,
    factors: Object
  },
  actualYield: Object,
  createdAt: Date
}
```

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── services/        # Business logic services
├── scripts/         # Utility scripts
├── server.js        # Main server file
└── package.json
```

### Adding New Features

1. **Create Model** (if needed) in `/models`
2. **Add Service Logic** in `/services`
3. **Create Routes** in `/routes`
4. **Add Validation** in `/middleware/validation.js`
5. **Update Server** to include new routes

## API Features

### AI Services
- **Pest Detection**: Computer vision-based pest identification
- **Yield Prediction**: ML models for crop yield forecasting
- **Crop Health Analysis**: Image-based health assessment

### Weather Integration
- Real-time weather data from OpenWeatherMap
- Farming recommendations based on weather
- Alert system for adverse conditions

### Market Data
- Live crop prices from government APIs
- Price trend analysis
- Market insights and recommendations

### Multilingual Support
- English and Hindi language support
- Localized recommendations and alerts

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Request rate limiting
- Input validation with Joi
- CORS configuration
- Helmet security headers

## Error Handling

The API uses consistent error response format:

```javascript
{
  success: false,
  message: "Error description",
  errors: ["Detailed error messages"]
}
```

Success responses:

```javascript
{
  success: true,
  message: "Success message",
  data: { /* response data */ }
}
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@cropcast.com or create an issue on GitHub.