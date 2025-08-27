import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { SERVICES } from '../constants';

interface HeaderProps {
    tagline: string;
    isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ tagline, isLoading }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % SERVICES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      {SERVICES.map((service, index) => (
        <div
          key={service.id}
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${service.imageUrl})`,
            opacity: index === currentImageIndex ? 1 : 0,
          }}
        />
      ))}
      
      <div className="absolute inset-0 bg-brand-green bg-opacity-50 z-10"></div>
      
      <div className="relative z-20 p-6 text-white">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl md:text-7xl font-bold tracking-tight mb-4 animate-fade-in-down">
          Nerza Agency
        </h1>
        <div className="h-8 flex items-center justify-center">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <p className="text-lg md:text-2xl font-light text-brand-beige animate-fade-in-up">
                    {tagline}
                </p>
            )}
        </div>
      </div>
       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce z-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    </header>
  );
};
