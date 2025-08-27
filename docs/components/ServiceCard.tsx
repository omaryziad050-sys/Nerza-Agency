
import React from 'react';
import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  return (
    <div className="group bg-brand-beige rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
      <div className="relative h-64">
        <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-brand-green mb-2">{service.title}</h3>
        <p className="text-brand-green-light text-sm mb-4 flex-grow">{service.description}</p>
        <button
          onClick={() => onSelect(service)}
          className="mt-auto w-full bg-brand-green text-white py-2 px-4 rounded-md font-semibold transition-all duration-300 ease-in-out
                     hover:bg-brand-green-light
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-light
                     bg-gradient-to-r from-green-600 to-teal-600
                     hover:from-green-700 hover:to-teal-700
                     shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Choisir
        </button>
      </div>
    </div>
  );
};