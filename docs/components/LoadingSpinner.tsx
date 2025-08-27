
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border-2 border-brand-beige border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};