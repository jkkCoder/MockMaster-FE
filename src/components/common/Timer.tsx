import React from 'react';
import { formatTime } from '../../utils/helpers';

interface TimerProps {
  seconds: number;
  className?: string;
  showWarning?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ seconds, className = '', showWarning = false }) => {
  const isLowTime = seconds < 300; // 5 minutes

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`text-2xl font-bold ${isLowTime ? 'text-red-600' : 'text-gray-800'}`}>
        {formatTime(seconds)}
      </div>
      {showWarning && isLowTime && (
        <span className="text-sm text-red-600 font-medium">Time running out!</span>
      )}
    </div>
  );
};
