import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6 ${onClick ? 'cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 hover:border-blue-200' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
