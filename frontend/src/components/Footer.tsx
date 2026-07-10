import React from 'react';
import { Coffee, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brownie text-cream border-t border-brownie-dark py-12 px-6 md:px-12 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        
        {/* Brand */}
        <div className="flex items-center space-x-2">
          <Coffee size={18} className="text-caramel-light" />
          <span className="font-estetika text-lg tracking-wide text-caramel-light font-bold">Jose</span>
        </div>

        {/* Static content credits */}
        <div className="text-center md:text-left text-xs text-cream-dark/70 font-light space-y-1">
          <p>Designed for absolute clarity and peaceful expense tracking.</p>
          <p className="flex items-center justify-center md:justify-start space-x-1">
            <span>Crafted with</span>
            <Heart size={10} className="text-caramel fill-caramel" />
            <span>using Django, React, and Tailwind CSS.</span>
          </p>
        </div>

        {/* Rights */}
        <div className="text-xs text-cream-dark/50 font-light">
          &copy; {new Date().getFullYear()} Jose. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
