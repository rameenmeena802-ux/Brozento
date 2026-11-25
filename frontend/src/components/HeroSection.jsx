import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSettings } from '../services/api';

const HeroSection = () => {
  const [settings, setSettings] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    getSettings().then(data => setSettings(data));
  }, []);

  // Slider Logic (Auto-play)
  const images = settings.heroImages || [];
  
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 4000); // Har 4 second mein image change hogi
      return () => clearInterval(interval);
    }
  }, [images.length]);

  return (
    <div className="container mx-auto px-4 mt-6">
      <div 
        className="relative rounded-2xl overflow-hidden flex items-center min-h-[350px] md:min-h-[450px] shadow-lg"
        style={{ backgroundColor: settings.heroBgColor || '#c40000' }}
      >
        
        {/* Video ya Image Background */}
        {settings.heroVideoUrl ? (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
            <source src={settings.heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          images.length > 0 && (
             <div 
               className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-60"
               style={{ backgroundImage: `url(${images[currentSlide]})` }}
             />
          )
        )}
        
        {/* Text Content */}
        <div className="relative z-10 p-8 md:p-14 w-full md:w-4/5">
          <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wider mb-4 inline-block shadow-sm">
            BROZENTO PREMIUM
          </span>
          <h2 
            className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-md"
            style={{ color: settings.heroTitleColor || '#ffffff' }}
          >
            {settings.heroTitle || "Restaurant Taste At Your Home."}
          </h2>
          <p className="text-gray-200 font-medium mb-8 text-lg max-w-md drop-shadow-md">
            {settings.heroSubtitle || "Premium restaurant masalas aur injectors."}
          </p>
          <Link 
            to="/shop" 
            className="bg-black text-white px-8 py-3.5 rounded-lg font-bold inline-flex items-center gap-2 hover:bg-gray-800 transition shadow-lg w-max"
          >
            Shop Masalas <ArrowRight size={20} />
          </Link>
        </div>

        {/* Slider Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;