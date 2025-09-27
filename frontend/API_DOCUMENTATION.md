# CropCast Backend API

## API Base URL
`http://localhost:5000/api`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/profile` | Get user profile | Yes |
| PUT | `/auth/profile` | Update profile | Yes |
| PUT | `/auth/change-password` | Change password | Yes |

### 🌤️ Weather
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/weather/current` | Current weather & forecast | No |
| GET | `/weather/alerts` | Weather alerts | No |
| GET | `/weather/recommendations` | Farming recommendations | Yes |
| GET | `/weather/history` | Historical weather | Yes |

### 🐛 Pest Detection
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/pest-detection/analyze` | Analyze crop image | Yes |
| GET | `/pest-detection/history` | Detection history | Yes |
| GET | `/pest-detection/:id` | Get specific detection | Yes |
| GET | `/pest-detection/stats/insights` | Get statistics | Yes |

### 📊 Yield Prediction
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/yield-prediction/predict` | Create prediction | Yes |
| GET | `/yield-prediction/history` | Prediction history | Yes |
| GET | `/yield-prediction/:id` | Get specific prediction | Yes |
| PUT | `/yield-prediction/:id/actual-yield` | Update actual yield | Yes |
| GET | `/yield-prediction/stats/insights` | Get statistics | Yes |

### 🌱 Soil Analysis
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/soil/test` | Submit soil test | Yes |
| GET | `/soil/tests` | Get test history | Yes |
| GET | `/soil/tests/:id` | Get specific test | Yes |
| GET | `/soil/fertilizer-guide/:cropType` | Fertilizer guide | No |
| GET | `/soil/analytics` | Soil analytics | Yes |
| GET | `/soil/mock-data` | Mock soil data | Yes |

### 💰 Market Prices
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/market/prices` | Current prices | No |
| GET | `/market/trends/:commodityId` | Price trends | No |
| GET | `/market/analysis` | Market analysis | No |
| POST | `/market/alerts` | Set price alert | Yes |
| GET | `/market/markets` | Available markets | No |
| GET | `/market/commodities` | Available commodities | No |

### 👤 User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/user/dashboard` | Dashboard data | Yes |
| PUT | `/user/preferences` | Update preferences | Yes |
| PUT | `/user/farm-details` | Update farm details | Yes |
| GET | `/user/activity-feed` | Activity feed | Yes |
| GET | `/user/statistics` | User statistics | Yes |
| PUT | `/user/location` | Update location | Yes |

## Request/Response Examples

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Farmer",
  "email": "john@example.com",
  "password": "securepass123",
  "phone": "9876543210",
  "location": {
    "state": "Maharashtra",
    "district": "Mumbai",
    "coordinates": { "lat": 19.0760, "lng": 72.8777 }
  },
  "farmDetails": {
    "totalArea": 5,
    "crops": [
      { "name": "wheat", "area": 2, "season": "rabi" },
      { "name": "rice", "area": 3, "season": "kharif" }
    ],
    "soilType": "alluvial"
  },
  "preferences": {
    "language": "en",
    "notifications": {
      "weather": true,
      "market": true,
      "pest": true
    }
  }
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

### Get Weather Data
```http
GET /api/weather/current?lat=19.0760&lng=72.8777&city=Mumbai&state=Maharashtra
```

### Analyze Pest Image
```http
POST /api/pest-detection/analyze
Content-Type: multipart/form-data
Authorization: Bearer <token>

image: [file]
cropType: wheat
location: {"coordinates": {"lat": 19.0760, "lng": 72.8777}}
```

### Create Yield Prediction
```http
POST /api/yield-prediction/predict
Content-Type: application/json
Authorization: Bearer <token>

{
  "soilType": "alluvial",
  "cropType": "wheat",
  "area": 5,
  "expectedRainfall": 600,
  "averageTemperature": 25,
  "season": "rabi",
  "location": {
    "coordinates": { "lat": 19.0760, "lng": 72.8777 },
    "address": "Mumbai, Maharashtra"  
  }
}
```

### Submit Soil Test
```http
POST /api/soil/test
Content-Type: application/json
Authorization: Bearer <token>

{
  "location": {
    "coordinates": { "lat": 19.0760, "lng": 72.8777 },
    "address": "Mumbai, Maharashtra",
    "fieldName": "Field 1"
  },
  "soilType": "alluvial",
  "testResults": {
    "ph": { "value": 6.8 },
    "nitrogen": { "value": 75, "unit": "%" },
    "phosphorus": { "value": 45, "unit": "%" },
    "potassium": { "value": 60, "unit": "%" },
    "organicMatter": { "value": 3.2, "unit": "%" },
    "moisture": { "value": 55, "unit": "%" }
  },
  "testMethod": "digital-sensor"
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limits
- `100 requests per 15 minutes` per IP address
- Higher limits for authenticated users

## CORS Configuration
- Frontend URL: `http://localhost:5173`
- Production URL: Configured per environment

## File Upload Limits
- Maximum file size: `10MB`
- Supported formats: `JPG, PNG, JPEG`
- Upload destination: Cloudinary (configured)

## Health Check
```http
GET /api/health

Response:
{
  "status": "OK",
  "timestamp": "2025-09-27T10:30:00.000Z",
  "uptime": 1200.5
}
```