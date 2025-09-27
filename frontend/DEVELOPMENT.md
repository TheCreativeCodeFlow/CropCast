# Development Setup Instructions

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ..
npm install
```

### 2. Environment Setup

**Backend Environment:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cropcast
JWT_SECRET=your-super-secret-jwt-key-here
WEATHER_API_KEY=your-openweathermap-api-key
```

**Frontend Environment:**
```bash
# Already created - check .env in root directory
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** by updating the MONGODB_URI in backend/.env

### 4. Start the Applications

**Option A: Start Both Simultaneously**
```bash
# From root directory
npm run dev:full
```

**Option B: Start Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## Project Structure

```
cropcast-agri-aid/
├── backend/                 # Node.js backend server
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── middleware/         # Custom middleware
│   └── server.js           # Main server file
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── services/           # API client services
│   └── main.tsx            # Main app entry
└── package.json            # Frontend dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Weather
- `GET /api/weather/current` - Current weather data
- `GET /api/weather/alerts` - Weather alerts

### Pest Detection
- `POST /api/pest-detection/analyze` - Analyze crop image
- `GET /api/pest-detection/history` - Detection history

### Yield Prediction
- `POST /api/yield-prediction/predict` - Create prediction
- `GET /api/yield-prediction/history` - Prediction history

### Soil Analysis
- `GET /api/soil/mock-data` - Mock soil data for demo
- `GET /api/soil/fertilizer-guide/:cropType` - Fertilizer recommendations

### Market Prices
- `GET /api/market/prices` - Current market prices
- `GET /api/market/analysis` - Market analysis

## Features Working

✅ **Backend API Server** - Complete with all endpoints
✅ **Database Models** - User, Pest Detection, Yield Prediction, etc.
✅ **Authentication System** - JWT-based auth
✅ **Weather Integration** - Real weather data support
✅ **AI Services** - Pest detection and yield prediction
✅ **Market Data** - Price tracking and analysis
✅ **Soil Analysis** - Health assessment and recommendations
✅ **Frontend Services** - API client integration
✅ **Multi-language Support** - English/Hindi

## Mock Data Available

Since external APIs require keys, the system includes comprehensive mock data:
- Weather data with forecasts and alerts
- Pest detection results with treatments
- Yield predictions with confidence scores
- Soil analysis with recommendations
- Market prices with trends

## Development Notes

1. **Database**: MongoDB runs on default port 27017
2. **CORS**: Configured for localhost:5173 (Vite dev server)
3. **File Uploads**: Configured for Cloudinary (optional)
4. **Error Handling**: Comprehensive error responses
5. **Validation**: Input validation with Joi
6. **Security**: Rate limiting, helmet, password hashing

## Troubleshooting

### Backend won't start:
- Check if MongoDB is running
- Verify .env file configuration
- Check if port 5000 is available

### Frontend won't connect:
- Ensure backend is running on port 5000
- Check VITE_API_BASE_URL in .env file
- Verify CORS settings in backend

### Database connection issues:
- Check MongoDB service status
- Verify MONGODB_URI in backend/.env
- Try connecting with MongoDB Compass

## Next Steps

1. **Add API Keys** for external services (weather, etc.)
2. **Configure Cloudinary** for image uploads
3. **Set up MongoDB Atlas** for production
4. **Deploy to Production** (Vercel + Railway/Heroku)
5. **Add Real-time Features** (WebSocket for live updates)

## Support

For issues, check the console logs:
- Backend logs in terminal running `npm run dev`
- Frontend logs in browser developer tools
- Network requests in browser Network tab