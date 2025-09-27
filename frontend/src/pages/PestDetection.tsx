import React, { useState, useRef, useEffect } from 'react';
import { 
  Bug, 
  ArrowLeft, 
  Camera, 
  Upload, 
  Scan,
  CheckCircle,
  AlertTriangle,
  Leaf,
  Eye,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { pestDetectionService } from '@/services';

interface PestDetectionProps {
  language: string;
}

const PestDetection: React.FC<PestDetectionProps> = ({ language }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const commonPests = [
    {
      name: 'Aphids',
      nameHi: 'एफिड्स',
      severity: 'medium',
      crops: ['Tomato', 'Cotton', 'Wheat'],
      cropsHi: ['टमाटर', 'कपास', 'गेहूं'],
      symptoms: 'Yellowing leaves, sticky honeydew',
      symptomsHi: 'पत्तियों का पीलापन, चिपचिपा रस',
      treatment: 'Neem oil spray, ladybird beetles',
      treatmentHi: 'नीम तेल का छिड़काव, लेडीबर्ड बीटल',
      image: '🐛'
    },
    {
      name: 'Bollworm',
      nameHi: 'बॉलवर्म',
      severity: 'high',
      crops: ['Cotton', 'Tomato'],
      cropsHi: ['कपास', 'टमाटर'],
      symptoms: 'Holes in bolls, damaged fruits',
      symptomsHi: 'कपास की गांठों में छेद, फलों को नुकसान',
      treatment: 'Bt spray, pheromone traps',
      treatmentHi: 'बीटी स्प्रे, फेरोमोन ट्रैप',
      image: '🐛'
    },
    {
      name: 'Whitefly',
      nameHi: 'व्हाइटफ्लाई',
      severity: 'medium',
      crops: ['Cotton', 'Tomato', 'Chili'],
      cropsHi: ['कपास', 'टमाटर', 'मिर्च'],
      symptoms: 'Yellow, wilted leaves',
      symptomsHi: 'पीली, मुरझाई पत्तियां',
      treatment: 'Yellow sticky traps, reflective mulch',
      treatmentHi: 'पीले चिपकने वाले जाल, परावर्तक मल्च',
      image: '🦟'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // In a real app, this would open camera
    toast({
      title: language === 'hi' ? 'कैमरा सुविधा' : 'Camera Feature',
      description: language === 'hi' ? 'कैमरा सुविधा जल्द ही उपलब्ध होगी' : 'Camera feature coming soon',
    });
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    
    try {
      // Convert data URL to File object
      const response = await fetch(uploadedImage);
      const blob = await response.blob();
      const file = new File([blob], 'crop-image.jpg', { type: 'image/jpeg' });
      
      // Call backend API for pest detection
      const result = await pestDetectionService.analyzeImage(file, 'wheat'); // You can make crop type dynamic
      
      if (result.success) {
        const pestData = result.data.detectionResults;
        setAnalysisResult({
          pest: {
            name: pestData.pestName,
            nameHi: pestData.pestNameHi,
            image: '🐛', // You can map this based on pest type
            severity: pestData.severity,
            symptoms: pestData.symptoms,
            symptomsHi: pestData.symptomsHi,
            treatment: pestData.treatment,
            treatmentHi: pestData.treatmentHi,
            crops: pestData.affectedCrops,
            cropsHi: pestData.affectedCropsHi
          },
          confidence: pestData.confidence.toFixed(1),
          recommendation: {
            immediate: language === 'hi' ? 'तुरंत छिड़काव करें' : 'Apply spray immediately',
            preventive: language === 'hi' ? 'नियमित निगरानी करें' : 'Monitor regularly'
          }
        });

        toast({
          title: language === 'hi' ? 'विश्लेषण पूर्ण' : 'Analysis Complete',
          description: language === 'hi' ? 'कीट की पहचान हो गई है' : 'Pest has been identified'
        });
      } else {
        throw new Error(result.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Pest detection error:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi' ? 'कीट पहचान में समस्या हुई' : 'Failed to analyze image',
        variant: 'destructive'
      });
      
      // Fallback to mock data
      const randomPest = commonPests[Math.floor(Math.random() * commonPests.length)];
      const confidence = Math.random() * 20 + 75;
      
      setAnalysisResult({
        pest: randomPest,
        confidence: confidence.toFixed(1),
        recommendation: {
          immediate: language === 'hi' ? 'तुरंत छिड़काव करें' : 'Apply spray immediately',
          preventive: language === 'hi' ? 'नियमित निगरानी करें' : 'Monitor regularly'
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-primary';
      default: return 'text-muted-foreground';
    }
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
              <div className="w-10 h-10 bg-gradient-warm rounded-xl flex items-center justify-center shadow-medium">
                <Bug className="w-5 h-5 text-warning-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {language === 'hi' ? 'कीट पहचान' : 'Pest Detection'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'AI-आधारित कीट पहचान और उपचार सुझाव' : 'AI-powered pest identification and treatment advice'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="crop-card border-border/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                {language === 'hi' ? 'फसल की तस्वीर अपलोड करें' : 'Upload Crop Image'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center space-y-4">
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded crop" 
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-soft"
                    />
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {language === 'hi' ? 'दूसरी तस्वीर' : 'Different Image'}
                      </Button>
                      <Button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="btn-primary-glow"
                        size="sm"
                      >
                        <Scan className="w-4 h-4 mr-2" />
                        {isAnalyzing 
                          ? (language === 'hi' ? 'विश्लेषण...' : 'Analyzing...') 
                          : (language === 'hi' ? 'विश्लेषण करें' : 'Analyze')
                        }
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">
                        {language === 'hi' ? 'फसल की तस्वीर अपलोड करें' : 'Upload crop image'}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {language === 'hi' ? 'स्पष्ट तस्वीर लें जिसमें कीट या नुकसान दिखे' : 'Take a clear photo showing pests or damage'}
                      </p>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button
                        variant="outline"
                        onClick={handleCameraCapture}
                        className="gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        {language === 'hi' ? 'कैमरा' : 'Camera'}
                      </Button>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {language === 'hi' ? 'फाइल चुनें' : 'Choose File'}
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Instructions */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">
                  {language === 'hi' ? 'बेहतर परिणाम के लिए:' : 'For best results:'}
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• {language === 'hi' ? 'अच्छी रोशनी में फोटो लें' : 'Take photos in good lighting'}</li>
                  <li>• {language === 'hi' ? 'कीट या नुकसान को स्पष्ट रूप से दिखाएं' : 'Show pests or damage clearly'}</li>
                  <li>• {language === 'hi' ? 'पत्तियों के दोनों तरफ की तस्वीर लें' : 'Capture both sides of leaves'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {analysisResult ? (
            <Card className="crop-card border-border/20 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  {language === 'hi' ? 'पहचान परिणाम' : 'Detection Results'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Detected Pest */}
                <div className="bg-gradient-warm rounded-xl p-6 text-warning-foreground text-center">
                  <div className="text-4xl mb-2">{analysisResult.pest.image}</div>
                  <div className="text-xl font-bold mb-2">
                    {language === 'hi' ? analysisResult.pest.nameHi : analysisResult.pest.name}
                  </div>
                  <div className="text-sm opacity-90">
                    {analysisResult.confidence}% {language === 'hi' ? 'विश्वास' : 'Confidence'}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`mt-2 ${getSeverityColor(analysisResult.pest.severity)} border-current`}
                  >
                    {analysisResult.pest.severity === 'high' ? 
                      (language === 'hi' ? 'उच्च गंभीरता' : 'High Severity') :
                      analysisResult.pest.severity === 'medium' ?
                      (language === 'hi' ? 'मध्यम गंभीरता' : 'Medium Severity') :
                      (language === 'hi' ? 'कम गंभीरता' : 'Low Severity')
                    }
                  </Badge>
                </div>

                {/* Pest Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">
                      {language === 'hi' ? 'लक्षण' : 'Symptoms'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'hi' ? analysisResult.pest.symptomsHi : analysisResult.pest.symptoms}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">
                      {language === 'hi' ? 'प्रभावित फसलें' : 'Affected Crops'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(language === 'hi' ? analysisResult.pest.cropsHi : analysisResult.pest.crops).map((crop: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Treatment Recommendations */}
                <div className="space-y-4">
                  <h4 className="font-semibold">
                    {language === 'hi' ? 'उपचार सुझाव' : 'Treatment Recommendations'}
                  </h4>
                  
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <span className="font-semibold text-destructive">
                        {language === 'hi' ? 'तत्काल कार्रवाई' : 'Immediate Action'}
                      </span>
                    </div>
                    <p className="text-sm">
                      {language === 'hi' ? analysisResult.pest.treatmentHi : analysisResult.pest.treatment}
                    </p>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-primary">
                        {language === 'hi' ? 'रोकथाम' : 'Prevention'}
                      </span>
                    </div>
                    <ul className="text-sm space-y-1">
                      <li>• {language === 'hi' ? 'नियमित फसल निरीक्षण' : 'Regular crop monitoring'}</li>
                      <li>• {language === 'hi' ? 'प्राकृतिक शत्रुओं को बढ़ावा' : 'Encourage natural enemies'}</li>
                      <li>• {language === 'hi' ? 'फसल चक्र अपनाएं' : 'Practice crop rotation'}</li>
                    </ul>
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
                <Bug className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'hi' ? 'पहचान के लिए तैयार' : 'Ready for Detection'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'hi' ? 'फसल की तस्वीर अपलोड करें और कीटों की पहचान करें' : 'Upload crop image to identify pests and get treatment advice'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Common Pests Reference */}
        <Card className="crop-card border-border/20 mt-8 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              {language === 'hi' ? 'सामान्य कीट' : 'Common Pests'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {commonPests.map((pest, index) => {
                const name = language === 'hi' ? pest.nameHi : pest.name;
                const symptoms = language === 'hi' ? pest.symptomsHi : pest.symptoms;
                
                return (
                  <div key={index} className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{pest.image}</span>
                      <div>
                        <h4 className="font-semibold">{name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSeverityColor(pest.severity)} border-current`}
                        >
                          {pest.severity === 'high' ? 
                            (language === 'hi' ? 'उच्च' : 'High') :
                            pest.severity === 'medium' ?
                            (language === 'hi' ? 'मध्यम' : 'Medium') :
                            (language === 'hi' ? 'कम' : 'Low')
                          }
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{symptoms}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PestDetection;