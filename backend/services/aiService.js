const axios = require('axios');

// AI service for pest detection and yield prediction
class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.openaiBaseUrl = 'https://api.openai.com/v1';
  }

  // Detect pest from uploaded image
  async detectPestFromImage(imageUrl, cropType) {
    try {
      // In a real implementation, this would use computer vision APIs
      // like Google Vision API, Azure Computer Vision, or custom trained models
      
      // For now, returning mock results based on crop type
      return this.generateMockPestDetection(cropType);
    } catch (error) {
      console.error('Pest detection error:', error);
      throw new Error('Failed to analyze image for pest detection');
    }
  }

  // Generate mock pest detection results
  generateMockPestDetection(cropType) {
    const pestDatabase = {
      wheat: [
        {
          pestName: 'Aphids',
          pestNameHi: 'एफिड्स',
          severity: 'medium',
          symptoms: 'Yellowing leaves, sticky honeydew on plant surface',
          symptomsHi: 'पत्तियों का पीलापन, पौधे की सतह पर चिपचिपा रस',
          treatment: 'Apply neem oil spray or introduce ladybird beetles as biological control',
          treatmentHi: 'नीम तेल का छिड़काव करें या जैविक नियंत्रण के रूप में लेडीबर्ड बीटल का उपयोग करें',
          affectedCrops: ['wheat', 'barley', 'oats'],
          affectedCropsHi: ['गेहूं', 'जौ', 'जई']
        },
        {
          pestName: 'Rust Fungus',
          pestNameHi: 'रस्ट फंगस',
          severity: 'high',
          symptoms: 'Orange-red pustules on leaves and stems',
          symptomsHi: 'पत्तियों और तनों पर नारंगी-लाल धब्बे',
          treatment: 'Apply fungicide spray and ensure proper air circulation',
          treatmentHi: 'फफूंदनाशी का छिड़काव करें और उचित वायु संचार सुनिश्चित करें',
          affectedCrops: ['wheat', 'barley'],
          affectedCropsHi: ['गेहूं', 'जौ']
        }
      ],
      rice: [
        {
          pestName: 'Brown Planthopper',
          pestNameHi: 'ब्राउन प्लांटहॉपर',
          severity: 'high',
          symptoms: 'Yellowing and wilting of plants, hopperburn symptoms',
          symptomsHi: 'पौधों का पीलापन और मुरझाना, हॉपरबर्न के लक्षण',
          treatment: 'Use resistant varieties and apply targeted insecticides',
          treatmentHi: 'प्रतिरोधी किस्मों का उपयोग करें और लक्षित कीटनाशकों का छिड़काव करें',
          affectedCrops: ['rice'],
          affectedCropsHi: ['चावल']
        },
        {
          pestName: 'Stem Borer',
          pestNameHi: 'स्टेम बोरर',
          severity: 'medium',
          symptoms: 'Dead hearts in vegetative stage, white heads in reproductive stage',
          symptomsHi: 'वानस्पतिक अवस्था में मृत दिल, प्रजनन अवस्था में सफेद सिर',
          treatment: 'Use pheromone traps and apply granular insecticides',
          treatmentHi: 'फेरोमोन ट्रैप का उपयोग करें और दानेदार कीटनाशकों का प्रयोग करें',
          affectedCrops: ['rice', 'sugarcane'],
          affectedCropsHi: ['चावल', 'गन्ना']
        }
      ],
      cotton: [
        {
          pestName: 'Bollworm',
          pestNameHi: 'बॉलवर्म',
          severity: 'high',
          symptoms: 'Holes in cotton bolls, damaged squares and flowers',
          symptomsHi: 'कपास की गांठों में छेद, क्षतिग्रस्त कलियां और फूल',
          treatment: 'Use Bt cotton varieties and apply targeted insecticides',
          treatmentHi: 'बीटी कपास की किस्मों का उपयोग करें और लक्षित कीटनाशकों का छिड़काव करें',
          affectedCrops: ['cotton', 'tomato'],
          affectedCropsHi: ['कपास', 'टमाटर']
        },
        {
          pestName: 'Whitefly',
          pestNameHi: 'व्हाइटफ्लाई',
          severity: 'medium',
          symptoms: 'Yellow, wilted leaves with sooty mold on lower surface',
          symptomsHi: 'पीली, मुरझाई पत्तियां जिनकी निचली सतह पर काला फंगस',
          treatment: 'Use yellow sticky traps and reflective mulch',
          treatmentHi: 'पीले चिपकने वाले जाल और परावर्तक मल्च का उपयोग करें',
          affectedCrops: ['cotton', 'tomato', 'chili'],
          affectedCropsHi: ['कपास', 'टमाटर', 'मिर्च']
        }
      ],
      tomato: [
        {
          pestName: 'Tomato Leaf Curl Virus',
          pestNameHi: 'टमाटर पत्ती कर्ल वायरस',
          severity: 'high',
          symptoms: 'Upward curling of leaves, stunted growth, reduced fruit size',
          symptomsHi: 'पत्तियों का ऊपर की ओर मुड़ना, रुकी हुई वृद्धि, फल का आकार कम',
          treatment: 'Control whitefly vectors and use virus-resistant varieties',
          treatmentHi: 'व्हाइटफ्लाई वेक्टर को नियंत्रित करें और वायरस प्रतिरोधी किस्मों का उपयोग करें',
          affectedCrops: ['tomato', 'chili'],
          affectedCropsHi: ['टमाटर', 'मिर्च']
        }
      ]
    };

    const cropPests = pestDatabase[cropType] || pestDatabase.wheat;
    const selectedPest = cropPests[Math.floor(Math.random() * cropPests.length)];
    
    // Add some randomness to confidence
    const confidence = Math.random() * 20 + 75; // 75-95%

    return {
      ...selectedPest,
      confidence: parseFloat(confidence.toFixed(1))
    };
  }

  // Predict crop yield using AI
  async predictYield(inputData) {
    try {
      // In a real implementation, this would use machine learning models
      // trained on historical yield data, weather patterns, soil conditions, etc.
      
      // For now, generating sophisticated mock predictions
      return this.generateYieldPrediction(inputData);
    } catch (error) {
      console.error('Yield prediction error:', error);
      throw new Error('Failed to generate yield prediction');
    }
  }

  // Generate yield prediction based on input parameters
  generateYieldPrediction(inputData) {
    const {
      soilType,
      cropType,
      area,
      expectedRainfall,
      averageTemperature,
      previousYield,
      fertilizers,
      irrigationType
    } = inputData;

    // Base yields by crop type (quintals per hectare)
    const baseYields = {
      wheat: 40,      // 40 quintals/hectare
      rice: 50,       // 50 quintals/hectare  
      cotton: 25,     // 25 quintals/hectare
      sugarcane: 650, // 650 quintals/hectare
      maize: 45,      // 45 quintals/hectare
      soybean: 20,    // 20 quintals/hectare
      mustard: 15,    // 15 quintals/hectare
      gram: 18        // 18 quintals/hectare
    };

    let predictedYield = baseYields[cropType] || 30;

    // Soil type impact
    const soilMultipliers = {
      alluvial: 1.15,   // Very fertile
      black: 1.10,      // Good for cotton, wheat
      red: 0.95,        // Moderate fertility
      sandy: 0.85,      // Low water retention
      clay: 0.90,       // Poor drainage
      loamy: 1.20       // Ideal soil
    };

    predictedYield *= (soilMultipliers[soilType] || 1.0);

    // Weather impact
    const optimalRainfall = {
      wheat: { min: 400, max: 600 },
      rice: { min: 1000, max: 1500 },
      cotton: { min: 500, max: 800 },
      sugarcane: { min: 1200, max: 1800 },
      maize: { min: 600, max: 900 }
    };

    const cropRainfall = optimalRainfall[cropType] || { min: 500, max: 800 };
    
    if (expectedRainfall < cropRainfall.min) {
      predictedYield *= 0.7; // Drought stress
    } else if (expectedRainfall > cropRainfall.max) {
      predictedYield *= 0.85; // Excess water stress
    } else {
      predictedYield *= 1.05; // Optimal rainfall
    }

    // Temperature impact
    const optimalTemp = {
      wheat: { min: 15, max: 25 },
      rice: { min: 25, max: 35 },
      cotton: { min: 25, max: 35 },
      sugarcane: { min: 20, max: 30 }
    };

    const cropTemp = optimalTemp[cropType] || { min: 20, max: 30 };
    
    if (averageTemperature < cropTemp.min || averageTemperature > cropTemp.max) {
      predictedYield *= 0.9; // Temperature stress
    }

    // Irrigation impact
    const irrigationMultipliers = {
      'drip': 1.15,
      'sprinkler': 1.10,
      'flood': 1.05,
      'rain-fed': 0.95
    };

    if (irrigationType && irrigationMultipliers[irrigationType]) {
      predictedYield *= irrigationMultipliers[irrigationType];
    }

    // Previous yield impact (if available)
    if (previousYield && previousYield > 0) {
      // Adjust based on historical performance
      const avgYield = (predictedYield + previousYield) / 2;
      predictedYield = avgYield * 1.02; // Slight improvement factor
    }

    // Add some randomness for model uncertainty
    const uncertainty = 0.85 + Math.random() * 0.3; // 0.85 to 1.15
    predictedYield *= uncertainty;

    // Convert to quintals per acre (1 hectare = 2.47 acres)
    const yieldPerAcre = predictedYield / 2.47;
    const totalProduction = yieldPerAcre * area;
    
    // Calculate confidence based on data quality
    let confidence = 85;
    if (previousYield) confidence += 5;
    if (irrigationType && irrigationType !== 'rain-fed') confidence += 3;
    if (fertilizers && fertilizers.length > 0) confidence += 2;
    
    // Add random variation
    confidence += (Math.random() - 0.5) * 10;
    confidence = Math.max(65, Math.min(95, confidence));

    // Generate factor contributions
    const factors = {
      soil: Math.min(100, Math.max(60, 80 + (soilMultipliers[soilType] - 1) * 50 + Math.random() * 10)),
      weather: Math.min(100, Math.max(50, 75 + Math.random() * 20)),
      crop: Math.min(100, Math.max(70, 85 + Math.random() * 10)),
      management: Math.min(100, Math.max(60, 75 + Math.random() * 15))
    };

    // Estimate revenue
    const marketPrices = {
      wheat: 2850,
      rice: 3200,
      cotton: 6800,
      sugarcane: 380,
      maize: 2400,
      soybean: 4500,
      mustard: 5200,
      gram: 5800
    };

    const pricePerQuintal = marketPrices[cropType] || 3000;
    const estimatedRevenue = totalProduction * pricePerQuintal;

    // Generate recommendations
    const recommendations = this.generateYieldRecommendations(inputData, predictedYield);

    return {
      yieldPerAcre: parseFloat(yieldPerAcre.toFixed(1)),
      totalProduction: parseFloat(totalProduction.toFixed(1)),
      confidence: parseFloat(confidence.toFixed(1)),
      factors: {
        soil: parseFloat(factors.soil.toFixed(1)),
        weather: parseFloat(factors.weather.toFixed(1)),
        crop: parseFloat(factors.crop.toFixed(1)),
        management: parseFloat(factors.management.toFixed(1))
      },
      estimatedRevenue: Math.round(estimatedRevenue),
      recommendations: recommendations.en,
      recommendationsHi: recommendations.hi
    };
  }

  // Generate yield-based recommendations
  generateYieldRecommendations(inputData, predictedYield) {
    const { cropType, soilType, expectedRainfall, irrigationType } = inputData;
    
    const recommendations = {
      en: [],
      hi: []
    };

    // Soil-based recommendations
    if (soilType === 'sandy') {
      recommendations.en.push('Apply organic matter to improve water retention');
      recommendations.hi.push('पानी की अवधारण के लिए जैविक खाद डालें');
    } else if (soilType === 'clay') {
      recommendations.en.push('Ensure proper drainage to prevent waterlogging');
      recommendations.hi.push('जल भराव रोकने के लिए उचित जल निकासी सुनिश्चित करें');
    }

    // Water management recommendations
    if (expectedRainfall < 500) {
      recommendations.en.push('Plan for supplemental irrigation during dry periods');
      recommendations.hi.push('सूखे की अवधि में अतिरिक्त सिंचाई की योजना बनाएं');
    }

    if (!irrigationType || irrigationType === 'rain-fed') {
      recommendations.en.push('Consider installing drip irrigation for better water efficiency');
      recommendations.hi.push('बेहतर पानी दक्षता के लिए ड्रिप सिंचाई स्थापित करने पर विचार करें');
    }

    // Crop-specific recommendations
    if (cropType === 'wheat') {
      recommendations.en.push('Apply nitrogen fertilizer in split doses for optimal uptake');
      recommendations.hi.push('इष्टतम अवशोषण के लिए नाइट्रोजन उर्वरक को विभाजित मात्रा में डालें');
    } else if (cropType === 'rice') {
      recommendations.en.push('Maintain 2-3 cm water level during critical growth stages');
      recommendations.hi.push('महत्वपूर्ण वृद्धि अवस्था में 2-3 सेमी पानी का स्तर बनाए रखें');
    } else if (cropType === 'cotton') {
      recommendations.en.push('Monitor for bollworm infestation during flowering stage');
      recommendations.hi.push('फूल आने की अवस्था में बॉलवर्म के संक्रमण की निगरानी करें');
    }

    // General recommendations
    recommendations.en.push('Conduct regular field monitoring for pest and disease symptoms');
    recommendations.hi.push('कीट और रोग के लक्षणों के लिए नियमित खेत निगरानी करें');

    recommendations.en.push('Follow recommended fertilizer schedule for your crop');
    recommendations.hi.push('अपनी फसल के लिए सुझाए गए उर्वरक कार्यक्रम का पालन करें');

    return recommendations;
  }

  // Analyze crop health from image (future feature)
  async analyzeCropHealth(imageUrl, cropType) {
    try {
      // This would use computer vision to analyze crop health
      // detecting nutrient deficiencies, diseases, etc.
      
      return {
        healthScore: Math.random() * 30 + 70, // 70-100%
        issues: [],
        recommendations: []
      };
    } catch (error) {
      console.error('Crop health analysis error:', error);
      throw new Error('Failed to analyze crop health');
    }
  }
}

// Export functions for use in routes
async function detectPestFromImage(imageUrl, cropType) {
  const aiService = new AIService();
  return await aiService.detectPestFromImage(imageUrl, cropType);
}

async function predictYield(inputData) {
  const aiService = new AIService();
  return await aiService.predictYield(inputData);
}

async function analyzeCropHealth(imageUrl, cropType) {
  const aiService = new AIService();
  return await aiService.analyzeCropHealth(imageUrl, cropType);
}

module.exports = {
  AIService,
  detectPestFromImage,
  predictYield,
  analyzeCropHealth
};