// Soil analysis and recommendation service

// Analyze soil health based on test results  
function analyzeSoilHealth(testResults) {
  const analysis = {
    testResults: {},
    overallHealth: {}
  };

  // pH Analysis
  const phValue = testResults.ph?.value || testResults.ph;
  analysis.testResults.ph = {
    value: phValue,
    status: getPhStatus(phValue)
  };

  // Nitrogen Analysis
  const nitrogenValue = testResults.nitrogen?.value || testResults.nitrogen;
  analysis.testResults.nitrogen = {
    value: nitrogenValue,
    unit: testResults.nitrogen?.unit || '%',
    status: getNutrientStatus(nitrogenValue, 'nitrogen')
  };

  // Phosphorus Analysis
  const phosphorusValue = testResults.phosphorus?.value || testResults.phosphorus;
  if (phosphorusValue !== undefined) {
    analysis.testResults.phosphorus = {
      value: phosphorusValue,
      unit: testResults.phosphorus?.unit || '%',
      status: getNutrientStatus(phosphorusValue, 'phosphorus')
    };
  }

  // Potassium Analysis
  const potassiumValue = testResults.potassium?.value || testResults.potassium;
  if (potassiumValue !== undefined) {
    analysis.testResults.potassium = {
      value: potassiumValue,
      unit: testResults.potassium?.unit || '%',
      status: getNutrientStatus(potassiumValue, 'potassium')
    };
  }

  // Organic Matter Analysis
  const organicMatterValue = testResults.organicMatter?.value || testResults.organicMatter;
  if (organicMatterValue !== undefined) {
    analysis.testResults.organicMatter = {
      value: organicMatterValue,
      unit: testResults.organicMatter?.unit || '%',
      status: getOrganicMatterStatus(organicMatterValue)
    };
  }

  // Moisture Analysis
  const moistureValue = testResults.moisture?.value || testResults.moisture;
  if (moistureValue !== undefined) {
    analysis.testResults.moisture = {
      value: moistureValue,
      unit: testResults.moisture?.unit || '%',
      status: getMoistureStatus(moistureValue)
    };
  }

  // Calculate overall health score
  analysis.overallHealth = calculateOverallHealth(analysis.testResults);

  return analysis;
}

// Get pH status
function getPhStatus(phValue) {
  if (phValue < 5.5) return 'critical';
  if (phValue < 6.0 || phValue > 7.5) return 'needs-attention';
  if (phValue > 8.0) return 'critical';
  return 'good';
}

// Get nutrient status
function getNutrientStatus(value, nutrient) {
  const thresholds = {
    nitrogen: { critical: 30, needsAttention: 50 },
    phosphorus: { critical: 20, needsAttention: 40 },
    potassium: { critical: 25, needsAttention: 45 }
  };

  const threshold = thresholds[nutrient] || thresholds.nitrogen;
  
  if (value < threshold.critical) return 'critical';
  if (value < threshold.needsAttention) return 'needs-attention';
  return 'good';
}

// Get organic matter status
function getOrganicMatterStatus(value) {
  if (value < 2.0) return 'critical';
  if (value < 3.0) return 'needs-attention';
  return 'good';
}

// Get moisture status
function getMoistureStatus(value) {
  if (value < 30) return 'critical';
  if (value < 45 || value > 85) return 'needs-attention';
  return 'good';
}

// Calculate overall health score
function calculateOverallHealth(testResults) {
  let totalScore = 0;
  let factors = 0;

  // Score each parameter
  Object.keys(testResults).forEach(key => {
    const result = testResults[key];
    if (result && result.status) {
      factors++;
      switch (result.status) {
        case 'good':
          totalScore += 100;
          break;
        case 'needs-attention':
          totalScore += 60;
          break;
        case 'critical':
          totalScore += 20;
          break;
      }
    }
  });

  const score = factors > 0 ? Math.round(totalScore / factors) : 0;
  
  let grade, status, statusHi;
  if (score >= 90) {
    grade = 'A';
    status = 'Excellent soil health';
    statusHi = 'उत्कृष्ट मिट्टी स्वास्थ्य';
  } else if (score >= 80) {
    grade = 'B';
    status = 'Good soil health';
    statusHi = 'अच्छा मिट्टी स्वास्थ्य';
  } else if (score >= 60) {
    grade = 'C';
    status = 'Fair soil health - needs improvement';
    statusHi = 'सामान्य मिट्टी स्वास्थ्य - सुधार की आवश्यकता';
  } else if (score >= 40) {
    grade = 'D';
    status = 'Poor soil health - immediate action needed';
    statusHi = 'खराब मिट्टी स्वास्थ्य - तुरंत कार्रवाई आवश्यक';
  } else {
    grade = 'F';
    status = 'Critical soil health - major intervention required';
    statusHi = 'गंभीर मिट्टी स्वास्थ्य - बड़े हस्तक्षेप की आवश्यकता';
  }

  return {
    score,
    grade,
    status,
    statusHi
  };
}

// Generate soil recommendations
function generateSoilRecommendations(testResults, soilType) {
  const recommendations = {
    immediate: [],
    immediateHi: [],
    longTerm: [],
    longTermHi: [],
    fertilizers: [],
    amendments: []
  };

  const analysis = analyzeSoilHealth(testResults);

  // pH recommendations
  if (analysis.testResults.ph.status === 'critical' || analysis.testResults.ph.status === 'needs-attention') {
    if (analysis.testResults.ph.value < 6.0) {
      recommendations.immediate.push('Apply lime to increase soil pH');
      recommendations.immediateHi.push('मिट्टी का pH बढ़ाने के लिए चूना डालें');
      recommendations.amendments.push({
        material: 'Agricultural Lime',
        materialHi: 'कृषि चूना',
        quantity: '200-400 kg/acre',
        purpose: 'Increase soil pH',
        purposeHi: 'मिट्टी का pH बढ़ाना'
      });
    } else if (analysis.testResults.ph.value > 7.5) {
      recommendations.immediate.push('Apply sulfur or organic matter to reduce soil pH');
      recommendations.immediateHi.push('मिट्टी का pH कम करने के लिए गंधक या जैविक खाद डालें');
      recommendations.amendments.push({
        material: 'Sulfur',
        materialHi: 'गंधक',
        quantity: '50-100 kg/acre',
        purpose: 'Reduce soil pH',
        purposeHi: 'मिट्टी का pH कम करना'
      });
    }
  }

  // Nitrogen recommendations
  if (analysis.testResults.nitrogen.status === 'critical' || analysis.testResults.nitrogen.status === 'needs-attention') {
    recommendations.immediate.push('Apply nitrogen-rich fertilizer immediately');
    recommendations.immediateHi.push('तुरंत नाइट्रोजन युक्त उर्वरक डालें');
    recommendations.fertilizers.push({
      name: 'Urea',
      nameHi: 'यूरिया',
      quantity: '100-150 kg/acre',
      timing: 'Split application - 50% at sowing, 50% after 30 days',
      timingHi: 'विभाजित डोज - 50% बुआई के समय, 50% 30 दिन बाद'
    });
  }

  // Phosphorus recommendations
  if (analysis.testResults.phosphorus && (analysis.testResults.phosphorus.status === 'critical' || analysis.testResults.phosphorus.status === 'needs-attention')) {
    recommendations.immediate.push('Apply phosphorus fertilizer before sowing');
    recommendations.immediateHi.push('बुआई से पहले फास्फोरस उर्वरक डालें');
    recommendations.fertilizers.push({
      name: 'DAP (Diammonium Phosphate)',
      nameHi: 'डीएपी (डायअमोनियम फास्फेट)',
      quantity: '75-100 kg/acre',
      timing: 'At the time of sowing',
      timingHi: 'बुआई के समय'
    });
  }

  // Potassium recommendations
  if (analysis.testResults.potassium && (analysis.testResults.potassium.status === 'critical' || analysis.testResults.potassium.status === 'needs-attention')) {
    recommendations.immediate.push('Apply potassium fertilizer');
    recommendations.immediateHi.push('पोटेशियम उर्वरक डालें');
    recommendations.fertilizers.push({
      name: 'MOP (Muriate of Potash)',
      nameHi: 'एमओपी (म्यूरिएट ऑफ पोटाश)',
      quantity: '50-75 kg/acre',
      timing: 'Before flowering stage',
      timingHi: 'फूल आने से पहले'
    });
  }

  // Organic matter recommendations
  if (analysis.testResults.organicMatter && (analysis.testResults.organicMatter.status === 'critical' || analysis.testResults.organicMatter.status === 'needs-attention')) {
    recommendations.longTerm.push('Increase organic matter content by adding compost or farmyard manure');
    recommendations.longTermHi.push('खाद या गोबर की खाद डालकर जैविक पदार्थ की मात्रा बढ़ाएं');
    recommendations.amendments.push({
      material: 'Farmyard Manure',
      materialHi: 'गोबर की खाद',
      quantity: '5-8 tons/acre',
      purpose: 'Improve soil organic matter and structure',
      purposeHi: 'मिट्टी के जैविक पदार्थ और संरचना में सुधार'
    });
  }

  // Soil type specific recommendations
  if (soilType) {
    const soilSpecificRecs = getSoilTypeRecommendations(soilType);
    recommendations.longTerm.push(...soilSpecificRecs.longTerm);
    recommendations.longTermHi.push(...soilSpecificRecs.longTermHi);
  }

  // General long-term recommendations
  recommendations.longTerm.push(
    'Implement crop rotation to maintain soil health',
    'Regular soil testing every 6 months',
    'Use cover crops during off-season'
  );
  recommendations.longTermHi.push(
    'मिट्टी के स्वास्थ्य को बनाए रखने के लिए फसल चक्र अपनाएं',
    'हर 6 महीने में नियमित मिट्टी परीक्षण',
    'ऑफ-सीजन में कवर क्रॉप का उपयोग करें'
  );

  return recommendations;
}

// Get soil type specific recommendations
function getSoilTypeRecommendations(soilType) {
  const recommendations = {
    longTerm: [],
    longTermHi: []
  };

  switch (soilType) {
    case 'sandy':
      recommendations.longTerm.push(
        'Add organic matter regularly to improve water retention',
        'Use drip irrigation to reduce water loss',
        'Apply frequent, light fertilizer applications'
      );
      recommendations.longTermHi.push(
        'पानी की अवधारण में सुधार के लिए नियमित रूप से जैविक पदार्थ जोड़ें',
        'पानी की हानि को कम करने के लिए ड्रिप सिंचाई का उपयोग करें',
        'हल्की और बार-बार उर्वरक डालें'
      );
      break;
    
    case 'clay':
      recommendations.longTerm.push(
        'Improve drainage by adding organic matter',
        'Avoid working soil when wet',
        'Use raised beds if drainage is poor'
      );
      recommendations.longTermHi.push(
        'जैविक पदार्थ मिलाकर जल निकासी में सुधार करें',
        'गीली मिट्टी में काम करने से बचें',
        'जल निकासी खराब हो तो उठी हुई क्यारियों का उपयोग करें'
      );
      break;
    
    case 'black':
      recommendations.longTerm.push(
        'Ensure proper drainage during monsoon',
        'Add gypsum if soil becomes too alkaline',
        'Practice deep plowing to break hardpan'
      );
      recommendations.longTermHi.push(
        'मानसून के दौरान उचित जल निकासी सुनिश्चित करें',
        'मिट्टी अधिक क्षारीय हो तो जिप्सम डालें',
        'कड़ी परत तोड़ने के लिए गहरी जुताई करें'
      );
      break;
    
    case 'red':
      recommendations.longTerm.push(
        'Add lime to correct acidity',
        'Use phosphorus-rich fertilizers',
        'Mulch to prevent erosion'
      );
      recommendations.longTermHi.push(
        'अम्लता ठीक करने के लिए चूना डालें',
        'फास्फोरस युक्त उर्वरकों का उपयोग करें',
        'कटाव रोकने के लिए मल्चिंग करें'
      );
      break;
    
    case 'alluvial':
      recommendations.longTerm.push(
        'Maintain organic matter levels',
        'Monitor for waterlogging in low areas',
        'Use balanced fertilization'
      );
      recommendations.longTermHi.push(
        'जैविक पदार्थ का स्तर बनाए रखें',
        'निचले क्षेत्रों में जल भराव की निगरानी करें',
        'संतुलित उर्वरीकरण का उपयोग करें'
      );
      break;
  }

  return recommendations;
}

// Get fertilizer recommendations for specific crops
function getCropSpecificFertilizerRecommendations(cropType, soilType, testResults) {
  const cropFertilizerGuide = {
    wheat: {
      baseRecommendation: {
        N: 120, // kg/hectare
        P2O5: 60,
        K2O: 40
      },
      splitApplication: {
        basal: { N: 25, P2O5: 100, K2O: 100 }, // % of total
        tillering: { N: 50 },
        flowering: { N: 25 }
      }
    },
    rice: {
      baseRecommendation: {
        N: 100,
        P2O5: 50,
        K2O: 50
      },
      splitApplication: {
        transplanting: { N: 25, P2O5: 100, K2O: 50 },
        tillering: { N: 50, K2O: 50 },
        panicle: { N: 25 }
      }
    },
    cotton: {
      baseRecommendation: {
        N: 150,
        P2O5: 75,
        K2O: 75
      },
      splitApplication: {
        sowing: { N: 25, P2O5: 100, K2O: 50 },
        squaring: { N: 50, K2O: 50 },
        flowering: { N: 25 }
      }
    }
  };

  const cropGuide = cropFertilizerGuide[cropType];
  if (!cropGuide) {
    return null;
  }

  // Adjust recommendations based on soil test results
  const adjustedRecommendation = adjustFertilizerBasedOnSoilTest(cropGuide.baseRecommendation, testResults);

  return {
    crop: cropType,
    recommendation: adjustedRecommendation,
    splitApplication: cropGuide.splitApplication
  };
}

// Adjust fertilizer recommendations based on soil test
function adjustFertilizerBasedOnSoilTest(baseRecommendation, testResults) {
  const adjusted = { ...baseRecommendation };

  // Adjust nitrogen based on soil nitrogen levels
  if (testResults.nitrogen) {
    if (testResults.nitrogen.value < 30) {
      adjusted.N *= 1.2; // Increase by 20%
    } else if (testResults.nitrogen.value > 70) {
      adjusted.N *= 0.8; // Decrease by 20%
    }
  }

  // Adjust phosphorus based on soil phosphorus levels
  if (testResults.phosphorus) {
    if (testResults.phosphorus.value < 20) {
      adjusted.P2O5 *= 1.3; // Increase by 30%
    } else if (testResults.phosphorus.value > 60) {
      adjusted.P2O5 *= 0.7; // Decrease by 30%
    }
  }

  // Adjust potassium based on soil potassium levels
  if (testResults.potassium) {
    if (testResults.potassium.value < 25) {
      adjusted.K2O *= 1.25; // Increase by 25%
    } else if (testResults.potassium.value > 65) {
      adjusted.K2O *= 0.75; // Decrease by 25%
    }
  }

  return adjusted;
}

module.exports = {
  analyzeSoilHealth,
  generateSoilRecommendations,
  getCropSpecificFertilizerRecommendations,
  calculateOverallHealth,
  getSoilTypeRecommendations
};