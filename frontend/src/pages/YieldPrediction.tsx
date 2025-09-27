import React, { useState } from 'react';
import { BarChart3, Leaf, ArrowLeft, Calculator, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { yieldPredictionService } from '@/services';

interface YieldPredictionProps {
  language: string;
}

const YieldPrediction: React.FC<YieldPredictionProps> = ({ language }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    soilType: '',
    cropType: '',
    rainfall: '',
    temperature: '28',
    area: ''
  });
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const soilTypes = [
    { value: 'alluvial', label: 'Alluvial Soil', labelHi: 'जलोढ़ मिट्टी' },
    { value: 'black', label: 'Black Soil', labelHi: 'काली मिट्टी' },
    { value: 'red', label: 'Red Soil', labelHi: 'लाल मिट्टी' },
    { value: 'sandy', label: 'Sandy Soil', labelHi: 'रेतीली मिट्टी' },
    { value: 'clay', label: 'Clay Soil', labelHi: 'चिकनी मिट्टी' }
  ];

  const cropTypes = [
    { value: 'wheat', label: 'Wheat', labelHi: 'गेहूं' },
    { value: 'rice', label: 'Rice', labelHi: 'चावल' },
    { value: 'cotton', label: 'Cotton', labelHi: 'कपास' },
    { value: 'sugarcane', label: 'Sugarcane', labelHi: 'गन्ना' },
    { value: 'maize', label: 'Maize', labelHi: 'मक्का' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    if (!formData.soilType || !formData.cropType || !formData.rainfall || !formData.area) {
      toast({
        title: language === 'hi' ? 'अधूरी जानकारी' : 'Incomplete Information',
        description: language === 'hi' ? 'कृपया सभी फील्ड भरें' : 'Please fill all fields',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Call backend API for yield prediction
      const predictionData = {
        soilType: formData.soilType,
        cropType: formData.cropType,
        area: parseFloat(formData.area),
        expectedRainfall: parseFloat(formData.rainfall),
        averageTemperature: parseFloat(formData.temperature),
        season: getCurrentSeason(),
        location: {
          coordinates: { lat: 19.0760, lng: 72.8777 }, // Make this dynamic
          address: 'Mumbai, Maharashtra'
        }
      };

      const response = await yieldPredictionService.createPrediction(predictionData);
      
      if (response.success) {
        const predictionResult = response.data.prediction;
        setPrediction({
          yield: predictionResult.yieldPerAcre.toFixed(1),
          confidence: predictionResult.confidence.toFixed(1),
          totalProduction: predictionResult.totalProduction.toFixed(1),
          factors: {
            soil: predictionResult.factors.soil,
            weather: predictionResult.factors.weather,
            crop: predictionResult.factors.crop
          },
          estimatedRevenue: predictionResult.estimatedRevenue,
          recommendations: predictionResult.recommendations,
          recommendationsHi: predictionResult.recommendationsHi
        });

        toast({
          title: language === 'hi' ? 'पूर्वानुमान तैयार' : 'Prediction Ready',
          description: language === 'hi' ? 'आपका उपज पूर्वानुमान तैयार है' : 'Your yield prediction is ready'
        });
      } else {
        throw new Error(response.message || 'Prediction failed');
      }
    } catch (error) {
      console.error('Yield prediction error:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi' ? 'उपज पूर्वानुमान में समस्या हुई' : 'Failed to generate prediction',
        variant: 'destructive'
      });
      
      // Fallback to mock prediction
      const baseYield = Math.random() * 20 + 15;
      const confidence = Math.random() * 20 + 75;
      
      setPrediction({
        yield: baseYield.toFixed(1),
        confidence: confidence.toFixed(1),
        totalProduction: (baseYield * parseFloat(formData.area)).toFixed(1),
        factors: {
          soil: Math.random() * 20 + 80,
          weather: Math.random() * 30 + 70,
          crop: Math.random() * 15 + 85
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get current season
  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 4 && month <= 6) return 'kharif';
    if (month >= 10 && month <= 3) return 'rabi';
    return 'zaid';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-card border-b border-border/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {language === 'hi' ? 'उपज पूर्वानुमान' : 'Yield Prediction'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'AI-आधारित फसल उत्पादन पूर्वानुमान' : 'AI-powered crop yield forecasting'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="crop-card border-border/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                {language === 'hi' ? 'फसल की जानकारी दर्ज करें' : 'Enter Crop Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Soil Type */}
              <div className="space-y-2">
                <Label>{language === 'hi' ? 'मिट्टी का प्रकार' : 'Soil Type'}</Label>
                <Select onValueChange={(value) => handleInputChange('soilType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'hi' ? 'मिट्टी का प्रकार चुनें' : 'Select soil type'} />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((soil) => (
                      <SelectItem key={soil.value} value={soil.value}>
                        {language === 'hi' ? soil.labelHi : soil.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Crop Type */}
              <div className="space-y-2">
                <Label>{language === 'hi' ? 'फसल का प्रकार' : 'Crop Type'}</Label>
                <Select onValueChange={(value) => handleInputChange('cropType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'hi' ? 'फसल चुनें' : 'Select crop'} />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((crop) => (
                      <SelectItem key={crop.value} value={crop.value}>
                        {language === 'hi' ? crop.labelHi : crop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Area */}
              <div className="space-y-2">
                <Label>{language === 'hi' ? 'क्षेत्रफल (एकड़ में)' : 'Area (in acres)'}</Label>
                <Input
                  type="number"
                  placeholder={language === 'hi' ? 'जैसे: 5' : 'e.g., 5'}
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                />
              </div>

              {/* Rainfall */}
              <div className="space-y-2">
                <Label>{language === 'hi' ? 'अपेक्षित वर्षा (mm)' : 'Expected Rainfall (mm)'}</Label>
                <Input
                  type="number"
                  placeholder={language === 'hi' ? 'जैसे: 800' : 'e.g., 800'}
                  value={formData.rainfall}
                  onChange={(e) => handleInputChange('rainfall', e.target.value)}
                />
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <Label>{language === 'hi' ? 'औसत तापमान (°C)' : 'Average Temperature (°C)'}</Label>
                <Input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                />
              </div>

              <Button 
                onClick={handlePredict} 
                disabled={isLoading}
                className="w-full btn-primary-glow"
              >
                {isLoading ? (
                  language === 'hi' ? 'गणना कर रहे हैं...' : 'Calculating...'
                ) : (
                  language === 'hi' ? 'उपज की भविष्यवाणी करें' : 'Predict Yield'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {prediction ? (
            <Card className="crop-card border-border/20 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  {language === 'hi' ? 'पूर्वानुमान परिणाम' : 'Prediction Results'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Prediction */}
                <div className="bg-gradient-primary rounded-xl p-6 text-primary-foreground text-center">
                  <div className="text-4xl font-bold mb-2">{prediction.yield}</div>
                  <div className="text-lg opacity-90">
                    {language === 'hi' ? 'क्विंटल प्रति एकड़' : 'Quintals per Acre'}
                  </div>
                  <div className="text-sm opacity-75 mt-2">
                    {prediction.confidence}% {language === 'hi' ? 'विश्वास' : 'Confidence'}
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{prediction.totalProduction}</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'hi' ? 'कुल उत्पादन (क्विंटल)' : 'Total Production (Quintals)'}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-sky">₹{(prediction.totalProduction * 2850).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'hi' ? 'अनुमानित आय' : 'Estimated Income'}
                    </div>
                  </div>
                </div>

                {/* Contributing Factors */}
                <div className="space-y-3">
                  <h4 className="font-semibold">
                    {language === 'hi' ? 'योगदान कारक' : 'Contributing Factors'}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'hi' ? 'मिट्टी की गुणवत्ता' : 'Soil Quality'}</span>
                      <span className="text-sm font-semibold text-primary">{prediction.factors.soil.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'hi' ? 'मौसम की स्थिति' : 'Weather Conditions'}</span>
                      <span className="text-sm font-semibold text-sky">{prediction.factors.weather.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'hi' ? 'फसल की किस्म' : 'Crop Variety'}</span>
                      <span className="text-sm font-semibold text-secondary">{prediction.factors.crop.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  {language === 'hi' ? 'रिपोर्ट सेव करें' : 'Save Report'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="crop-card border-border/20 animate-fade-in">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Leaf className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'hi' ? 'पूर्वानुमान के लिए तैयार' : 'Ready for Prediction'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'hi' ? 'अपनी फसल की जानकारी भरें और उपज का पूर्वानुमान प्राप्त करें' : 'Fill in your crop details and get yield predictions'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default YieldPrediction;