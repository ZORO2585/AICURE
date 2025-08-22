import React from 'react';
import { Phone, Mail, MapPin, Sprout } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sprout className="h-6 w-6 text-green-400" />
              <span className="text-lg font-bold">AgriHealth AI</span>
            </div>
            <p className="text-gray-300 text-sm">
              Empowering farmers with AI-powered disease detection and agricultural intelligence
              for healthier crops and livestock.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Emergency Contacts</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Vet Helpline: +1-800-VET-HELP</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Crop Support: +1-800-CROP-911</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@agrihealthai.com</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div>Disease Library</div>
              <div>Treatment Guide</div>
              <div>Expert Network</div>
              <div>Training Videos</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          © 2024 AgriHealth AI. All rights reserved. Built for farmers, by agricultural technology experts.
        </div>
      </div>
    </footer>
  );
};

export default Footer;