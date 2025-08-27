
import React from 'react';

interface AboutProps {
    aboutText: string;
}

export const About: React.FC<AboutProps> = ({ aboutText }) => {
  return (
    <section id="about" className="py-16 md:py-24 text-center">
      <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl md:text-4xl font-bold text-brand-green mb-6">
        L'Agence
      </h2>
      <div className="max-w-3xl mx-auto">
        <p className="text-lg md:text-xl text-brand-green-light leading-relaxed">
            {aboutText}
        </p>
      </div>
    </section>
  );
};
