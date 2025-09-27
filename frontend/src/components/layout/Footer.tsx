import React from 'react';
import { Heart, Leaf, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="glass-card mt-16 border-t border-border/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CropCast
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Designed for Farmers, Powered by AI 🌱💡
            </p>
            <p className="text-muted-foreground text-sm">
              Empowering farmers with smart agricultural solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="/yield-prediction" className="text-muted-foreground hover:text-primary transition-colors">Yield Prediction</a></li>
              <li><a href="/weather" className="text-muted-foreground hover:text-primary transition-colors">Weather</a></li>
              <li><a href="/soil-guide" className="text-muted-foreground hover:text-primary transition-colors">Soil Guide</a></li>
              <li><a href="/pest-detection" className="text-muted-foreground hover:text-primary transition-colors">Pest Detection</a></li>
              <li><a href="/market-prices" className="text-muted-foreground hover:text-primary transition-colors">Market Prices</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+91 1800-CROP-HELP</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>support@cropcast.in</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Agricultural Tech Hub, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 CropCast. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-warning fill-current" />
            <span>for Indian Farmers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;