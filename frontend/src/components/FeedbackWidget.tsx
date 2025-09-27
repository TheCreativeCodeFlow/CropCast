import React, { useMemo, useState } from 'react';
import { MessageSquare, Star, StarHalf, Download, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';

interface FeedbackWidgetProps {
  language?: 'en' | 'hi';
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ language = 'en' }) => {
  const { toast } = useToast();
  const { saveFeedback, exportAll, trackEvent } = useAnalytics();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [includeUsage, setIncludeUsage] = useState(true);

  const labels = useMemo(() => ({
    title: language === 'hi' ? 'प्रतिपुष्टि' : 'Feedback',
    desc: language === 'hi' ? 'हमें CropCast बेहतर बनाने में मदद करें' : 'Help us improve CropCast',
    yourRating: language === 'hi' ? 'आपकी रेटिंग' : 'Your rating',
    yourFeedback: language === 'hi' ? 'आपकी प्रतिक्रिया' : 'Your feedback',
    includeUsage: language === 'hi' ? 'उपयोग डेटा शामिल करें' : 'Include usage data',
    submit: language === 'hi' ? 'जमा करें' : 'Submit',
    export: language === 'hi' ? 'डेटा निर्यात करें' : 'Export Data',
  }), [language]);

  const submit = () => {
    saveFeedback({ rating, message, language, includeUsage });
    setOpen(false);
    setMessage('');
    setRating(5);
    trackEvent('feedback_opened');
    toast({
      title: language === 'hi' ? 'धन्यवाद!' : 'Thank you!',
      description: language === 'hi' ? 'आपकी प्रतिक्रिया सहेजी गई है।' : 'Your feedback has been saved.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-label="Open feedback" variant="secondary" size="icon" className="fixed bottom-6 right-6 rounded-full shadow-soft z-50">
          <MessageSquare className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{labels.desc}</p>
        </DialogHeader>

        {/* Rating */}
        <div className="space-y-3">
          <Label className="text-sm">{labels.yourRating}</Label>
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map((n) => (
              <button key={n} onClick={() => setRating(n)} className="p-1" aria-label={`rate ${n}`}>
                {rating >= n ? <Star className="w-6 h-6 text-warning" fill="currentColor" /> : <Star className="w-6 h-6 text-muted-foreground" />}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-2">
          <Label htmlFor="feedback" className="text-sm">{labels.yourFeedback}</Label>
          <Textarea id="feedback" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={language === 'hi' ? 'यहां लिखें…' : 'Type here…'} />
        </div>

        {/* Include usage toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
          <div>
            <Label className="text-sm">{labels.includeUsage}</Label>
            <p className="text-xs text-muted-foreground">{language === 'hi' ? 'घटनाएं और उपयोग मेट्रिक्स (लोकल में सहेजा गया)' : 'Events and usage metrics (stored locally)'} </p>
          </div>
          <Switch checked={includeUsage} onCheckedChange={setIncludeUsage} />
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={exportAll} className="gap-2">
            <Download className="w-4 h-4" /> {labels.export}
          </Button>
          <Button onClick={submit} className="gap-2">
            <Send className="w-4 h-4" /> {labels.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackWidget;
