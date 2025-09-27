import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  ArrowLeft, 
  TestTube, 
  Droplets, 
  Zap,
  CheckCircle,
  AlertCircle,
  XCircle,
  Leaf,
  Calculator,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { soilService } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { soilMock } from '@/mocks/soil';
import { useAnalytics } from '@/hooks/useAnalytics';

interface SoilGuideProps {
  language: string;
}

const SoilGuide: React.FC<SoilGuideProps> = ({ language }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [soilData, setSoilData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch soil data on component mount
  useEffect(() => {
    trackEvent('page_view', { page: 'soil-guide' });
    fetchSoilData();
  }, []);

  const fetchSoilData = async () => {
    try {
      setLoading(true);
      const response = await soilService.getMockData();
      
      if (response.success) {
        setSoilData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch soil data');
      }
    } catch (err: any) {
      // Use demo data when API fails
      setSoilData(soilMock);
      setError(null);
      trackEvent('soil_mock_used', { reason: err?.message });
      toast({
        title: language === 'hi' ? 'डेमो डेटा' : 'Demo Data',
        description: language === 'hi' ? 'बैकएंड उपलब्ध नहीं — डेमो मिट्टी डेटा दिखाया जा रहा है।' : 'Backend unavailable — showing demo soil data.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Comprehensive mock soil health data
  const soilHealth = soilData?.testResults || {
    ph: { value: 6.8, status: 'good', optimal: '6.0-7.5', recommendation: 'Ideal for most crops' },
    nitrogen: { value: 75, status: 'good', optimal: '70-85%', recommendation: 'Maintain with regular organic matter' },
    phosphorus: { value: 45, status: 'needs-attention', optimal: '60-80%', recommendation: 'Apply DAP or SSP fertilizer' },
    potassium: { value: 60, status: 'good', optimal: '55-70%', recommendation: 'Supplement with MOP during flowering' },
    organicMatter: { value: 3.2, status: 'good', optimal: '2.5-4.0%', recommendation: 'Add compost annually' },
    moisture: { value: 55, status: 'good', optimal: '50-60%', recommendation: 'Adequate for current season' },
    calcium: { value: 65, status: 'good', optimal: '60-75%', recommendation: 'Sufficient for crop growth' },
    magnesium: { value: 42, status: 'needs-attention', optimal: '50-65%', recommendation: 'Apply Epsom salt if deficiency symptoms appear' },
    sulfur: { value: 38, status: 'needs-attention', optimal: '45-60%', recommendation: 'Use sulfur-containing fertilizers' },
    iron: { value: 28, status: 'critical', optimal: '40-60%', recommendation: 'Apply iron chelate or FeSO4 immediately' },
    zinc: { value: 52, status: 'good', optimal: '45-65%', recommendation: 'Monitor, may need supplementation in sandy soils' },
    boron: { value: 35, status: 'needs-attention', optimal: '40-55%', recommendation: 'Apply borax before flowering crops' }
  };

  const crops = [
    {
      id: 'wheat',
      name: 'Wheat',
      nameHi: 'गेहूं',
      icon: '🌾',
      idealPh: '6.0-7.5',
      npkRatio: '4:2:1',
      season: 'Rabi',
      seasonHi: 'रबी',
      soilType: 'Loamy, Well-drained',
      soilTypeHi: 'दोमट, अच्छी जल निकासी',
      fertilizers: [
        { name: 'Urea (46% N)', nameHi: 'यूरिया (46% नाइट्रोजन)', amount: '120 kg/acre', timing: 'Pre-sowing + 30 days after sowing', cost: '₹2,880' },
        { name: 'DAP (18:46:0)', nameHi: 'डीएपी (18:46:0)', amount: '50 kg/acre', timing: 'At time of sowing', cost: '₹1,400' },
        { name: 'MOP (0:0:60)', nameHi: 'एमओपी (0:0:60)', amount: '25 kg/acre', timing: 'At time of sowing', cost: '₹600' },
        { name: 'Zinc Sulfate', nameHi: 'जिंक सल्फेट', amount: '10 kg/acre', timing: 'Before sowing (if deficient)', cost: '₹250' }
      ],
      organicOptions: [
        { name: 'FYM', nameHi: 'गोबर की खाद', amount: '5-8 tons/acre', timing: '15 days before sowing' },
        { name: 'Vermicompost', nameHi: 'केंचुआ खाद', amount: '2-3 tons/acre', timing: 'At sowing' },
        { name: 'Neem Cake', nameHi: 'नीम खली', amount: '200 kg/acre', timing: 'Before sowing' }
      ],
      tips: [
        'Apply nitrogen in 2-3 split doses for better efficiency',
        'Ensure proper drainage to prevent waterlogging',
        'Monitor for iron and zinc deficiency, especially in alkaline soils',
        'Use bio-fertilizers like Azotobacter for nitrogen fixation',
        'Apply phosphorus at sowing for better root development'
      ],
      tipsHi: [
        'बेहतर दक्षता के लिए नाइट्रोजन को 2-3 भागों में दें',
        'जल भराव रोकने के लिए उचित जल निकासी सुनिश्चित करें',
        'क्षारीय मिट्टी में आयरन और जिंक की कमी की निगरानी करें',
        'नाइट्रोजन स्थिरीकरण के लिए एजोटोबैक्टर जैसे जैव-उर्वरकों का उपयोग करें',
        'बेहतर जड़ विकास के लिए बुआई के समय फास्फोरस दें'
      ]
    },
    {
      id: 'rice',
      name: 'Rice',
      nameHi: 'चावल',
      icon: '🌾',
      idealPh: '5.5-6.5',
      npkRatio: '3:1:2',
      season: 'Kharif',
      seasonHi: 'खरीफ',
      soilType: 'Clay Loam, Waterlogged',
      soilTypeHi: 'चिकनी दोमट, जल भराव',
      fertilizers: [
        { name: 'Urea (46% N)', nameHi: 'यूरिया (46% नाइट्रोजन)', amount: '100 kg/acre', timing: '1/3 at transplant, 1/3 at tillering, 1/3 at panicle initiation', cost: '₹2,400' },
        { name: 'SSP (16% P)', nameHi: 'एसएसपी (16% फास्फोरस)', amount: '75 kg/acre', timing: 'Before transplanting', cost: '₹900' },
        { name: 'MOP (0:0:60)', nameHi: 'एमओपी (0:0:60)', amount: '35 kg/acre', timing: 'At transplanting + tillering stage', cost: '₹840' },
        { name: 'Zinc Sulfate', nameHi: 'जिंक सल्फेट', amount: '15 kg/acre', timing: '10 days after transplanting', cost: '₹375' }
      ],
      organicOptions: [
        { name: 'Green Manure', nameHi: 'हरी खाद', amount: '15-20 kg/acre (Sesbania)', timing: '45 days before transplanting' },
        { name: 'FYM', nameHi: 'गोबर की खाद', amount: '4-6 tons/acre', timing: '2 weeks before transplanting' },
        { name: 'Azolla', nameHi: 'एजोला', amount: 'Fresh application', timing: 'After transplanting (bio-fertilizer)' }
      ],
      tips: [
        'Maintain 2-3 cm water level throughout growing period',
        'Apply zinc sulfate if leaves show yellowing',
        'Use System of Rice Intensification (SRI) for better yields',
        'Incorporate blue-green algae for natural nitrogen',
        'Avoid over-application of nitrogen to prevent lodging'
      ],
      tipsHi: [
        'बढ़ती अवधि के दौरान 2-3 सेमी पानी का स्तर बनाए रखें',
        'पत्तियों के पीले होने पर जिंक सल्फेट दें',
        'बेहतर उपज के लिए धान गहनीकरण प्रणाली (SRI) का उपयोग करें',
        'प्राकृतिक नाइट्रोजन के लिए नील-हरित शैवाल का उपयोग करें',
        'गिरने से बचने के लिए नाइट्रोजन का अधिक प्रयोग न करें'
      ]
    },
    {
      id: 'cotton',
      name: 'Cotton',
      nameHi: 'कपास',
      icon: '🌱',
      idealPh: '6.0-8.0',
      npkRatio: '6:3:3',
      season: 'Kharif',
      seasonHi: 'खरीफ',
      soilType: 'Black Cotton Soil, Well-drained',
      soilTypeHi: 'काली कपास मिट्टी, अच्छी जल निकासी',
      fertilizers: [
        { name: 'Urea (46% N)', nameHi: 'यूरिया (46% नाइट्रोजन)', amount: '150 kg/acre', timing: 'Split in 3 doses: sowing, squaring, flowering', cost: '₹3,600' },
        { name: 'DAP (18:46:0)', nameHi: 'डीएपी (18:46:0)', amount: '75 kg/acre', timing: 'Full dose at sowing', cost: '₹2,100' },
        { name: 'MOP (0:0:60)', nameHi: 'एमओपी (0:0:60)', amount: '50 kg/acre', timing: 'Half at sowing, half at flowering', cost: '₹1,200' },
        { name: 'Boron', nameHi: 'बोरॉन', amount: '2 kg/acre', timing: 'At squaring and flowering stage', cost: '₹400' }
      ],
      organicOptions: [
        { name: 'FYM', nameHi: 'गोबर की खाद', amount: '6-10 tons/acre', timing: '3 weeks before sowing' },
        { name: 'Cotton Stalks Compost', nameHi: 'कपास के डंठल की खाद', amount: '3-4 tons/acre', timing: 'Before field preparation' },
        { name: 'Castor Cake', nameHi: 'अरंडी की खली', amount: '250 kg/acre', timing: 'At sowing' }
      ],
      tips: [
        'Deep plowing (20-25 cm) recommended for better root penetration',
        'Apply boron for better boll formation and fiber quality',
        'Monitor soil salinity, especially in arid regions',
        'Use drip irrigation for water and nutrient efficiency',
        'Split potassium application for sustained boll development'
      ],
      tipsHi: [
        'बेहतर जड़ प्रवेश के लिए गहरी जुताई (20-25 सेमी) की सिफारिश',
        'बेहतर बॉल निर्माण और फाइबर गुणवत्ता के लिए बोरॉन दें',
        'विशेषकर शुष्क क्षेत्रों में मिट्टी की लवणता की निगरानी करें',
        'पानी और पोषक तत्व दक्षता के लिए ड्रिप सिंचाई का उपयोग करें',
        'निरंतर बॉल विकास के लिए पोटेशियम का विभाजित प्रयोग करें'
      ]
    },
    {
      id: 'maize',
      name: 'Maize',
      nameHi: 'मक्का',
      icon: '🌽',
      idealPh: '6.0-7.5',
      npkRatio: '4:2:1',
      season: 'Kharif/Rabi',
      seasonHi: 'खरीफ/रबी',
      soilType: 'Sandy Loam, Well-drained',
      soilTypeHi: 'बलुई दोमट, अच्छी जल निकासी',
      fertilizers: [
        { name: 'Urea (46% N)', nameHi: 'यूरिया (46% नाइट्रोजन)', amount: '130 kg/acre', timing: '1/3 at sowing, 1/3 at knee-high, 1/3 at tasseling', cost: '₹3,120' },
        { name: 'DAP (18:46:0)', nameHi: 'डीएपी (18:46:0)', amount: '60 kg/acre', timing: 'Full dose at sowing', cost: '₹1,680' },
        { name: 'MOP (0:0:60)', nameHi: 'एमओपी (0:0:60)', amount: '30 kg/acre', timing: 'At sowing', cost: '₹720' },
        { name: 'Zinc Sulfate', nameHi: 'जिंक सल्फेट', amount: '12 kg/acre', timing: 'Before sowing (if deficient)', cost: '₹300' }
      ],
      organicOptions: [
        { name: 'FYM', nameHi: 'गोबर की खाद', amount: '8-10 tons/acre', timing: '2-3 weeks before sowing' },
        { name: 'Poultry Manure', nameHi: 'मुर्गी की खाद', amount: '3-4 tons/acre', timing: 'Before field preparation' },
        { name: 'Bone Meal', nameHi: 'हड्डी का चूर्ण', amount: '100 kg/acre', timing: 'At sowing for phosphorus' }
      ],
      tips: [
        'Ensure adequate spacing (60x20 cm) for proper growth',
        'Apply nitrogen when plants are 45-50 cm tall',
        'Monitor for stem borer and apply IPM practices',
        'Provide adequate irrigation during tasseling and grain filling',
        'Use hybrid varieties for better yield potential'
      ],
      tipsHi: [
        'उचित विकास के लिए पर्याप्त दूरी (60x20 सेमी) सुनिश्चित करें',
        'पौधे 45-50 सेमी लंबे होने पर नाइट्रोजन दें',
        'तना छेदक की निगरानी करें और IPM प्रथाओं का पालन करें',
        'फूल और दाना भरने के दौरान पर्याप्त सिंचाई प्रदान करें',
        'बेहतर उपज क्षमता के लिए संकर किस्मों का उपयोग करें'
      ]
    },
    {
      id: 'tomato',
      name: 'Tomato',
      nameHi: 'टमाटर',
      icon: '🍅',
      idealPh: '6.0-7.0',
      npkRatio: '2:1:2',
      season: 'Year Round',
      seasonHi: 'साल भर',
      soilType: 'Sandy Loam, Rich in Organic Matter',
      soilTypeHi: 'बलुई दोमट, जैविक पदार्थ युक्त',
      fertilizers: [
        { name: 'Urea (46% N)', nameHi: 'यूरिया (46% नाइट्रोजन)', amount: '80 kg/acre', timing: 'Weekly splits after transplanting', cost: '₹1,920' },
        { name: 'DAP (18:46:0)', nameHi: 'डीएपी (18:46:0)', amount: '100 kg/acre', timing: 'At transplanting + flowering', cost: '₹2,800' },
        { name: 'MOP (0:0:60)', nameHi: 'एमओपी (0:0:60)', amount: '65 kg/acre', timing: 'Split during fruit development', cost: '₹1,560' },
        { name: 'Calcium Nitrate', nameHi: 'कैल्शियम नाइट्रेट', amount: '40 kg/acre', timing: 'During fruit development', cost: '₹1,200' }
      ],
      organicOptions: [
        { name: 'Vermicompost', nameHi: 'केंचुआ खाद', amount: '4-5 tons/acre', timing: 'Before transplanting' },
        { name: 'Neem Cake', nameHi: 'नीम खली', amount: '300 kg/acre', timing: 'At transplanting' },
        { name: 'Seaweed Extract', nameHi: 'समुद्री शैवाल अर्क', amount: '2-3 l/acre', timing: 'Foliar spray during growth' }
      ],
      tips: [
        'Maintain consistent soil moisture to prevent fruit cracking',
        'Apply calcium to prevent blossom end rot',
        'Use mulching to conserve soil moisture',
        'Regular pruning and staking for better fruit quality',
        'Monitor pH regularly as tomatoes are sensitive to acidic conditions'
      ],
      tipsHi: [
        'फल फटने से बचने के लिए मिट्टी में नमी बनाए रखें',
        'फूल के अंत में सड़न रोकने के लिए कैल्शियम दें',
        'मिट्टी की नमी बचाने के लिए मल्चिंग का उपयोग करें',
        'बेहतर फल गुणवत्ता के लिए नियमित छंटाई और सहारा दें',
        'नियमित रूप से pH की जांच करें क्योंकि टमाटर अम्लीय स्थितियों के प्रति संवेदनशील है'
      ]
    }
  ];

  const currentCrop = crops.find(crop => crop.id === selectedCrop) || crops[0];

  const getSoilHealthStatus = (value: number, type: string) => {
    let status = 'good';
    let color = 'text-primary';
    let icon = CheckCircle;

    if (type === 'ph') {
      if (value < 6.0 || value > 7.5) {
        status = 'needs-attention';
        color = 'text-warning';
        icon = AlertCircle;
      }
      if (value < 5.5 || value > 8.0) {
        status = 'critical';
        color = 'text-destructive';
        icon = XCircle;
      }
    } else {
      if (value < 40) {
        status = 'critical';
        color = 'text-destructive';
        icon = XCircle;
      } else if (value < 60) {
        status = 'needs-attention';
        color = 'text-warning';
        icon = AlertCircle;
      }
    }

    return { status, color, icon };
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      good: language === 'hi' ? 'अच्छा' : 'Good',
      'needs-attention': language === 'hi' ? 'ध्यान चाहिए' : 'Needs Attention',
      critical: language === 'hi' ? 'गंभीर' : 'Critical'
    };
    return statusMap[status] || status;
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
              <div className="w-10 h-10 bg-gradient-earth rounded-xl flex items-center justify-center shadow-medium">
                <Sprout className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {language === 'hi' ? 'मिट्टी और उर्वरक गाइड' : 'Soil & Fertilizer Guide'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'मिट्टी स्वास्थ्य और उर्वरक सिफारिशें' : 'Soil health analysis and fertilizer recommendations'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="soil-health" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="soil-health">
              {language === 'hi' ? 'मिट्टी स्वास्थ्य' : 'Soil Health'}
            </TabsTrigger>
            <TabsTrigger value="fertilizer-guide">
              {language === 'hi' ? 'उर्वरक गाइड' : 'Fertilizer Guide'}
            </TabsTrigger>
          </TabsList>

          {/* Soil Health Tab */}
          <TabsContent value="soil-health" className="space-y-6">
            {/* Current Soil Status */}
            <Card className="soil-card border-0 text-secondary-foreground animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  {language === 'hi' ? 'वर्तमान मिट्टी स्थिति' : 'Current Soil Status'}
                </CardTitle>
                <p className="text-sm opacity-90">
                  {language === 'hi' ? 'आपकी मिट्टी का स्वास्थ्य विश्लेषण' : 'Your soil health analysis'}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'ph', label: 'pH Level', labelHi: 'pH स्तर', value: soilHealth.ph, unit: '', icon: TestTube },
                    { key: 'nitrogen', label: 'Nitrogen', labelHi: 'नाइट्रोजन', value: soilHealth.nitrogen, unit: '%', icon: Leaf },
                    { key: 'phosphorus', label: 'Phosphorus', labelHi: 'फास्फोरस', value: soilHealth.phosphorus, unit: '%', icon: Zap },
                    { key: 'potassium', label: 'Potassium', labelHi: 'पोटेशियम', value: soilHealth.potassium, unit: '%', icon: Sprout },
                    { key: 'organicMatter', label: 'Organic Matter', labelHi: 'जैविक पदार्थ', value: soilHealth.organicMatter, unit: '%', icon: Leaf },
                    { key: 'moisture', label: 'Moisture', labelHi: 'नमी', value: soilHealth.moisture, unit: '%', icon: Droplets },
                    { key: 'calcium', label: 'Calcium', labelHi: 'कैल्शियम', value: soilHealth.calcium, unit: '%', icon: TestTube },
                    { key: 'magnesium', label: 'Magnesium', labelHi: 'मैग्नीशियम', value: soilHealth.magnesium, unit: '%', icon: Zap },
                    { key: 'sulfur', label: 'Sulfur', labelHi: 'सल्फर', value: soilHealth.sulfur, unit: '%', icon: Sprout },
                    { key: 'iron', label: 'Iron', labelHi: 'आयरन', value: soilHealth.iron, unit: '%', icon: TestTube },
                    { key: 'zinc', label: 'Zinc', labelHi: 'जिंक', value: soilHealth.zinc, unit: '%', icon: Leaf },
                    { key: 'boron', label: 'Boron', labelHi: 'बोरॉन', value: soilHealth.boron, unit: '%', icon: Zap }
                  ].map((item) => {
                    const { status, color, icon: StatusIcon } = getSoilHealthStatus(item.value.value || item.value, item.key);
                    const Icon = item.icon;
                    const label = language === 'hi' ? item.labelHi : item.label;
                    const displayValue = item.value.value || item.value;
                    
                    return (
                      <div key={item.key} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-2">
                          <Icon className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                          <StatusIcon className={`w-4 h-4 ${color} group-hover:scale-110 transition-transform`} />
                        </div>
                        <div className="text-2xl font-bold mb-1">
                          {displayValue}{item.unit}
                        </div>
                        <div className="text-xs opacity-90 mb-2">{label}</div>
                        <Badge variant="outline" className={`text-xs ${color} border-current`}>
                          {getStatusText(status)}
                        </Badge>
                        {item.value.optimal && (
                          <div className="text-xs opacity-70 mt-1">
                            {language === 'hi' ? 'आदर्श:' : 'Optimal:'} {item.value.optimal}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Soil Recommendations */}
            <Card className="crop-card border-border/20 animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  {language === 'hi' ? 'सुधार सुझाव' : 'Improvement Recommendations'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <h4 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      {language === 'hi' ? 'गंभीर समस्याएं - तत्काल कार्रवाई' : 'Critical Issues - Immediate Action'}
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                        <span>
                          {language === 'hi' 
                            ? 'आयरन की गंभीर कमी (28%) - तुरंत आयरन चिलेट या FeSO4 का प्रयोग करें'
                            : 'Severe iron deficiency (28%) - Apply iron chelate or FeSO4 immediately'
                          }
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <h4 className="font-semibold text-warning mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {language === 'hi' ? 'ध्यान देने योग्य - जल्द सुधार' : 'Needs Attention - Improve Soon'}
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-warning rounded-full mt-2 flex-shrink-0" />
                        <span>
                          {language === 'hi' 
                            ? 'फास्फोरस का स्तर कम (45%) - DAP या SSP उर्वरक की सिफारिश'
                            : 'Phosphorus levels low (45%) - DAP or SSP fertilizer recommended'
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-warning rounded-full mt-2 flex-shrink-0" />
                        <span>
                          {language === 'hi'
                            ? 'मैग्नीशियम की कमी (42%) - एप्सम सॉल्ट का प्रयोग करें'
                            : 'Magnesium deficiency (42%) - Apply Epsom salt'
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-warning rounded-full mt-2 flex-shrink-0" />
                        <span>
                          {language === 'hi'
                            ? 'सल्फर की कमी (38%) - सल्फर युक्त उर्वरकों का उपयोग करें'
                            : 'Sulfur deficiency (38%) - Use sulfur-containing fertilizers'
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-warning rounded-full mt-2 flex-shrink-0" />
                        <span>
                          {language === 'hi'
                            ? 'बोरॉन की कमी (35%) - फूल आने से पहले बोरेक्स का प्रयोग करें'
                            : 'Boron deficiency (35%) - Apply borax before flowering'
                          }
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {language === 'hi' ? 'दीर्घकालिक स्वास्थ्य योजना' : 'Long-term Health Plan'}
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          {language === 'hi'
                            ? 'नियमित मिट्टी जांच (6 महीने में एक बार) जारी रखें'
                            : 'Continue regular soil testing (every 6 months)'
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          {language === 'hi'
                            ? 'जैविक खाद (वर्मी कंपोस्ट/FYM) का नियमित उपयोग बढ़ाएं'
                            : 'Increase regular use of organic matter (vermicompost/FYM)'
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          {language === 'hi'
                            ? 'फसल चक्र अपनाएं - दलहनी फसलों को शामिल करें'
                            : 'Implement crop rotation - include leguminous crops'
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>
                          {language === 'hi'
                            ? 'माइक्रो-न्यूट्रिएंट मिश्रण का वार्षिक उपयोग करें'
                            : 'Apply micronutrient mixture annually'
                          }
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fertilizer Guide Tab */}
          <TabsContent value="fertilizer-guide" className="space-y-6">
            {/* Crop Selection */}
            <Card className="crop-card border-border/20 animate-fade-in">
              <CardHeader>
                <CardTitle>
                  {language === 'hi' ? 'फसल चुनें' : 'Select Crop'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {crops.map((crop) => {
                    const name = language === 'hi' ? crop.nameHi : crop.name;
                    return (
                      <Button
                        key={crop.id}
                        variant={selectedCrop === crop.id ? 'default' : 'outline'}
                        className="h-auto p-4 flex flex-col gap-2"
                        onClick={() => setSelectedCrop(crop.id)}
                      >
                        <span className="text-2xl">{crop.icon}</span>
                        <span className="text-sm">{name}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Fertilizer Recommendations */}
            <Card className="crop-card border-border/20 animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{currentCrop.icon}</span>
                  {language === 'hi' ? `${currentCrop.nameHi} के लिए उर्वरक` : `Fertilizers for ${currentCrop.name}`}
                </CardTitle>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>
                    {language === 'hi' ? 'आदर्श pH:' : 'Ideal pH:'} {currentCrop.idealPh}
                  </span>
                  <span>
                    {language === 'hi' ? 'NPK अनुपात:' : 'NPK Ratio:'} {currentCrop.npkRatio}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      {language === 'hi' ? 'उर्वरक कार्यक्रम और लागत' : 'Fertilizer Schedule & Cost'}
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      {language === 'hi' ? 'कुल लागत:' : 'Total Cost:'} 
                      <span className="font-semibold text-primary ml-1">
                        {currentCrop.fertilizers.reduce((total, f) => {
                          const cost = parseInt(f.cost?.replace('₹', '').replace(',', '') || '0');
                          return total + cost;
                        }, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </span>
                    </div>
                  </div>
                  
                  {currentCrop.fertilizers.map((fertilizer, index) => (
                    <div key={index} className="bg-muted/30 rounded-lg p-4 hover:shadow-soft transition-all duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-lg">
                            {language === 'hi' ? fertilizer.nameHi : fertilizer.name}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{fertilizer.timing}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary text-lg">{fertilizer.amount}</div>
                          {fertilizer.cost && (
                            <div className="text-sm text-muted-foreground">{fertilizer.cost}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Organic Alternatives */}
                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                    <h4 className="font-semibold text-secondary mb-3 flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      {language === 'hi' ? 'जैविक विकल्प' : 'Organic Alternatives'}
                    </h4>
                    <div className="grid gap-3">
                      {currentCrop.organicOptions?.map((organic, index) => (
                        <div key={index} className="bg-secondary/5 rounded p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              {language === 'hi' ? organic.nameHi : organic.name}
                            </div>
                            <div className="text-xs text-muted-foreground">{organic.timing}</div>
                          </div>
                          <div className="text-sm font-medium text-secondary">
                            {organic.amount}
                          </div>
                        </div>
                      )) || (
                        <div className="text-sm text-muted-foreground">
                          {language === 'hi' ? 'जैविक विकल्प जल्द उपलब्ध होंगे' : 'Organic options coming soon'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Crop Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/20 rounded-lg p-4">
                      <h5 className="font-medium mb-2 text-sm">
                        {language === 'hi' ? 'फसल जानकारी' : 'Crop Information'}
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{language === 'hi' ? 'मौसम:' : 'Season:'}</span>
                          <span>{language === 'hi' ? currentCrop.seasonHi : currentCrop.season}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{language === 'hi' ? 'मिट्टी:' : 'Soil Type:'}</span>
                          <span className="text-right text-xs">{language === 'hi' ? currentCrop.soilTypeHi : currentCrop.soilType}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 rounded-lg p-4">
                      <h5 className="font-medium mb-2 text-sm">
                        {language === 'hi' ? 'आदर्श स्थितियां' : 'Ideal Conditions'}
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">pH:</span>
                          <span>{currentCrop.idealPh}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">NPK:</span>
                          <span>{currentCrop.npkRatio}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Farming Tips */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-semibold text-primary mb-3">
                    {language === 'hi' ? 'विशेष सुझाव' : 'Special Tips'}
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {(language === 'hi' ? currentCrop.tipsHi : currentCrop.tips).map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SoilGuide;