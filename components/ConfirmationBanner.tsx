
import React from 'react';

interface ConfirmationBannerProps {
  onClose: () => void;
}

export const ConfirmationBanner: React.FC<ConfirmationBannerProps> = ({ onClose }) => {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-brand-green text-white py-3 px-6 rounded-lg shadow-2xl flex items-center space-x-4 z-50 animate-slide-in-up">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Réservation confirmée ! Vous recevrez un email de confirmation.</span>
      <button onClick={onClose} className="text-gray-300 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
