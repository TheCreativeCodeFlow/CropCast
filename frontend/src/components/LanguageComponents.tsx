import React, { useState, useEffect, useContext } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import LoadingIndicator from './LoadingIndicator';
import { useToast } from '../hooks/use-toast';
import { translationService } from '../services';
import { Globe, Languages, Copy, Check } from 'lucide-react';

// Define types for Language Context
interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  supportedLanguages: Record<string, string>;
  translateText: (text: string, context?: string) => Promise<string>;
  isTranslating: boolean;
}

// Create a Language Context for app-wide language management
const LanguageContext = React.createContext<LanguageContextType>({
  currentLanguage: 'en',
  setCurrentLanguage: () => {},
  supportedLanguages: {},
  translateText: async () => '',
  isTranslating: false
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language Provider Component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('preferredLanguage') || 'en';
  });
  const [supportedLanguages, setSupportedLanguages] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSupportedLanguages();
  }, []);

  useEffect(() => {
    localStorage.setItem('preferredLanguage', currentLanguage);
  }, [currentLanguage]);

  const loadSupportedLanguages = async () => {
    try {
      const response = await translationService.getSupportedLanguages();
      if (response.success) {
        setSupportedLanguages(response.data.languages);
      }
    } catch (error) {
      console.error('Failed to load supported languages:', error);
      // Fallback to common languages - convert array to object
      const commonLangs = translationService.getCommonLanguages();
      const langObject = commonLangs.reduce((acc, lang) => {
        acc[lang.code] = lang.nativeName;
        return acc;
      }, {} as Record<string, string>);
      setSupportedLanguages(langObject);
    }
  };

  const translateText = async (text, context = 'general') => {
    if (currentLanguage === 'en') return text;
    
    setIsTranslating(true);
    try {
      const response = await translationService.translateAgriculturalContent(
        text,
        currentLanguage,
        context
      );
      
      if (response.success) {
        return response.data.translatedText;
      }
      return text;
    } catch (error) {
      console.error('Translation failed:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  const value = {
    currentLanguage,
    setCurrentLanguage,
    supportedLanguages,
    translateText,
    isTranslating
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Language Selector Component
interface LanguageSelectorProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'default', className = '' }) => {
  const { currentLanguage, setCurrentLanguage, supportedLanguages } = useLanguage();
  const commonLanguages = translationService.getCommonLanguages();

  const getCurrentLanguageName = () => {
    const lang = commonLanguages.find(l => l.code === currentLanguage);
    return lang ? lang.nativeName : 'English';
  };

  if (variant === 'compact') {
    return (
      <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
        <SelectTrigger className={`w-auto ${className}`}>
          <Globe className="h-4 w-4 mr-2" />
          <SelectValue placeholder={getCurrentLanguageName()} />
        </SelectTrigger>
        <SelectContent>
          {commonLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{lang.nativeName}</span>
                <span className="text-xs text-muted-foreground">{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Languages className="h-5 w-5" />
          <span>Language / भाषा</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {commonLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-xs text-muted-foreground">{lang.name}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-3 text-xs text-muted-foreground">
          Current: {getCurrentLanguageName()}
        </div>
      </CardContent>
    </Card>
  );
};

// Translation Component for showing original and translated text
interface TranslatedTextProps {
  text: string;
  context?: string;
  showOriginal?: boolean;
  className?: string;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  text, 
  context = 'general', 
  showOriginal = false,
  className = '' 
}) => {
  const { currentLanguage, translateText, isTranslating } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslatedText(text);
      return;
    }

    const performTranslation = async () => {
      const translated = await translateText(text, context);
      setTranslatedText(translated);
    };

    performTranslation();
  }, [text, currentLanguage, context, translateText]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  if (isTranslating) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <LoadingIndicator size="sm" />
        <span className="text-sm text-muted-foreground">Translating...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p>{translatedText}</p>
          {showOriginal && currentLanguage !== 'en' && (
            <details className="mt-2">
              <summary className="text-xs text-muted-foreground cursor-pointer">
                Show original
              </summary>
              <p className="text-sm text-muted-foreground mt-1 italic">
                Original: {text}
              </p>
            </details>
          )}
        </div>
        {translatedText && (
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="ml-2 h-8 w-8 p-0"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

// Batch Translation Component for handling multiple texts
interface BatchTranslationPanelProps {
  className?: string;
}

export const BatchTranslationPanel: React.FC<BatchTranslationPanelProps> = ({ className = '' }) => {
  const [texts, setTexts] = useState(['']);
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [results, setResults] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();
  const commonLanguages = translationService.getCommonLanguages();

  const addTextField = () => {
    if (texts.length < 10) {
      setTexts([...texts, '']);
    }
  };

  const removeTextField = (index) => {
    if (texts.length > 1) {
      setTexts(texts.filter((_, i) => i !== index));
    }
  };

  const updateText = (index, value) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const handleBatchTranslation = async () => {
    const nonEmptyTexts = texts.filter(text => text.trim());
    if (nonEmptyTexts.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one text to translate",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    try {
      const response = await translationService.batchTranslate(nonEmptyTexts, targetLanguage);
      
      if (response.success) {
        setResults(response.data.results);
        toast({
          title: "Success",
          description: `Translated ${response.data.totalTranslated} out of ${nonEmptyTexts.length} texts`
        });
      }
    } catch (error) {
      console.error('Batch translation failed:', error);
      toast({
        title: "Error",
        description: "Batch translation failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Batch Translation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Target Language:</label>
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {commonLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {texts.map((text, index) => (
            <div key={index} className="flex space-x-2">
              <textarea
                value={text}
                onChange={(e) => updateText(index, e.target.value)}
                placeholder={`Text ${index + 1}...`}
                className="flex-1 min-h-[80px] p-3 border rounded-md resize-none"
              />
              {texts.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeTextField(index)}
                  className="self-start mt-2"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={addTextField}
            disabled={texts.length >= 10}
          >
            Add Text Field
          </Button>
          
          <Button
            onClick={handleBatchTranslation}
            disabled={isTranslating}
            className="flex-1"
          >
            {isTranslating ? (
              <>
                <LoadingIndicator size="sm" />
                <span className="ml-2">Translating...</span>
              </>
            ) : (
              'Translate All'
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium">Translation Results:</h4>
            {results.map((result, index) => (
              <div key={index} className="p-3 bg-muted rounded-md">
                {result.success ? (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">Original</Badge>
                      <span className="text-sm">{result.originalText}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge>Translated</Badge>
                      <span className="text-sm font-medium">{result.translatedText}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600 text-sm">
                    Failed to translate: {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};