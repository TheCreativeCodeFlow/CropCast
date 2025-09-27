# 🌾 CropCast - Agricultural Intelligence Platform

CropCast is a comprehensive agricultural platform that provides farmers with intelligent insights through weather data, market prices, pest detection, soil analysis, and yield predictions. The platform features multilingual support powered by Google Gemini AI, making it accessible to farmers worldwide.

## ✨ Features

- 🌤️ **Weather Intelligence**: Real-time weather data and farming recommendations
- 📈 **Market Analytics**: Live market prices and trend analysis
- 🐛 **Pest Detection**: AI-powered pest identification and management
- 🌱 **Soil Health**: Comprehensive soil analysis and recommendations
- 📊 **Yield Prediction**: Data-driven crop yield forecasting
- 🌍 **Multilingual Support**: 30+ languages including regional Indian languages
- 🤖 **AI-Powered Translations**: Context-aware agricultural translations using Google Gemini
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- MongoDB (local or cloud)
- Google Gemini API key (for translation features)

### Installation

#### Option 1: Automated Setup (Recommended)

**For Windows (PowerShell):**
```powershell
# Run the setup script
.\setup.ps1

# Start the full application
.\start-full.ps1
```

**For Linux/Mac (Bash):**
```bash
# Make setup script executable
chmod +x setup.sh

# Run the setup script
./setup.sh

# Start the full application
./start-full.sh
```

#### Option 2: Manual Setup

1. **Clone and setup backend:**
```bash
cd backend
npm install
```

2. **Setup frontend:**
```bash
cd frontend
npm install
```

3. **Configure environment variables:**
```bash
# Backend .env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
WEATHER_API_KEY=your_openweather_api_key
JWT_SECRET=your_jwt_secret

# Frontend .env (already configured)
VITE_API_BASE_URL=http://localhost:5000/api
```

4. **Start the applications:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## 🔧 Configuration

### Backend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key for translations | ✅ |
| `WEATHER_API_KEY` | OpenWeatherMap API key | ✅ |
| `JWT_SECRET` | Secret for JWT token generation | ✅ |
| `CLOUDINARY_*` | Cloudinary config for image uploads | ❌ |
| `PORT` | Server port (default: 5000) | ❌ |

### Getting API Keys

1. **Google Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file as `GEMINI_API_KEY`

2. **OpenWeatherMap API Key:**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key
   - Add it to your `.env` file as `WEATHER_API_KEY`

## 🌐 API Documentation

### Authentication Endpoints

```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login  
GET  /api/auth/profile     # Get user profile
PUT  /api/auth/profile     # Update profile
```

### Translation Endpoints

```http
GET  /api/translation/languages              # Get supported languages
POST /api/translation/translate              # Translate text
POST /api/translation/detect                 # Detect language
POST /api/translation/translate/agricultural # Context-aware translation
POST /api/translation/translate/batch        # Batch translation
```

### Agricultural Data Endpoints

```http
GET /api/weather/current          # Current weather data
GET /api/weather/recommendations  # Weather-based recommendations
GET /api/market/prices           # Market prices
GET /api/market/trends/:commodity # Price trends
GET /api/pest-detection          # Pest detection services
GET /api/soil/recommendations    # Soil analysis
GET /api/yield-prediction        # Yield predictions
```

## 🌍 Multilingual Features

### Supported Languages

The platform supports 30+ languages including:

- **International**: English, Spanish, French, German, Portuguese, Russian, Chinese, Japanese, Korean
- **Indian Regional**: Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Punjabi, Kannada, Malayalam, Odia

### Translation Contexts

Context-aware translations are provided for:

- `weather` - Weather reports and farming recommendations
- `market` - Market prices and trading information  
- `pest` - Pest identification and management
- `soil` - Soil analysis and recommendations
- `yield` - Crop yield predictions
- `general` - General agricultural content

### Usage Examples

```javascript
import { translationService } from './services';

// Basic translation
const result = await translationService.translateText(
  "The weather is good for planting", 
  "hi"
);

// Context-aware translation
const result = await translationService.translateAgriculturalContent(
  "Apply nitrogen fertilizer to improve soil health",
  "hi", 
  "soil"
);

// Batch translation
const results = await translationService.batchTranslate([
  "Weather forecast",
  "Market prices", 
  "Pest control"
], "hi");
```

## 🧪 Testing

### Integration Tests

Run comprehensive integration tests:

```bash
# Windows
.\test-integration.bat

# Linux/Mac  
./test-integration.sh

# Or manually
cd backend && node test-integration.js
```

### Manual Testing

1. **Start both servers**
2. **Visit the frontend** at `http://localhost:5173`
3. **Test API endpoints** at `http://localhost:5000/api/health`
4. **Try translation features** by changing language in the UI

## 📁 Project Structure

```
CropCast/
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic services
│   ├── middleware/         # Express middleware
│   └── server.js           # Main server file
├── frontend/               # React/Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client services
│   │   └── hooks/          # Custom React hooks
│   └── public/             # Static assets
├── setup.ps1              # Windows setup script
├── setup.sh               # Linux/Mac setup script
└── README.md              # This file
```

## 🔄 Backend-Frontend Integration

### API Client Configuration

The frontend uses a centralized API client (`apiClient.js`) that:

- Handles authentication tokens automatically
- Provides consistent error handling
- Supports both JSON and FormData requests
- Manages base URL configuration

### Service Layer Architecture

Each domain has dedicated services on both ends:

**Backend Services:**
- `translationService.js` - Gemini AI integration
- `weatherService.js` - Weather data processing
- `marketService.js` - Market data aggregation
- `soilService.js` - Soil analysis logic

**Frontend Services:**
- `translationService.js` - Translation API calls
- `weatherService.js` - Weather data fetching
- `marketService.js` - Market data handling
- React components for UI integration

### Data Flow

1. **User Interaction** → Frontend Component
2. **Service Call** → Frontend Service Layer  
3. **API Request** → Backend Route Handler
4. **Business Logic** → Backend Service Layer
5. **Database/External API** → Data Processing
6. **Response** → Frontend → UI Update

## 🎨 Frontend Features

### Language Components

- `LanguageProvider` - Global language context
- `LanguageSelector` - Language switching UI
- `TranslatedText` - Automatic text translation
- `BatchTranslationPanel` - Bulk translation tool

### Key Components

- **Dashboard** - Main overview page
- **Weather Widget** - Real-time weather display
- **Market Ticker** - Live price updates
- **Translation Demo** - Multilingual showcase
- **AI Assistant** - Intelligent farming advice

### Responsive Design

- Mobile-first approach using Tailwind CSS
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements
- Optimized performance on mobile devices

## 🔒 Security Features

- JWT-based authentication
- Request rate limiting
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- Environment variable protection

## 🚀 Deployment

### Development

```bash
# Start development servers
npm run dev        # Frontend only
npm run dev:full   # Both backend and frontend
```

### Production Build

```bash
# Build frontend
cd frontend && npm run build

# Start production backend
cd backend && npm start
```

### Environment Setup

- **Development**: Uses local MongoDB and API endpoints
- **Production**: Configure with production database and API keys
- **Docker**: Docker configurations available for containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

1. **Translation not working**: Check `GEMINI_API_KEY` in backend `.env`
2. **Database connection failed**: Verify `MONGODB_URI` configuration
3. **CORS errors**: Ensure frontend URL is in backend CORS origins
4. **Port conflicts**: Check if ports 5000/5173 are available

### Getting Help

- Check the integration test results for specific error details
- Review browser console for frontend issues
- Check backend logs for API errors
- Ensure all environment variables are properly configured

### Contact

For questions or support, please create an issue in the repository or contact the development team.

---

**Built with ❤️ for farmers worldwide** 🌾