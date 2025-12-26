import React, { memo } from 'react';
import { formatTime } from '../../utils/helpers';

interface TimerProps {
  seconds: number;
  className?: string;
  showWarning?: boolean;
}

const TimerComponent: React.FC<TimerProps> = ({ seconds, className = '', showWarning = false }) => {
  const isLowTime = seconds < 300; // 5 minutes

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`px-4 py-2.5 rounded-xl font-bold text-xl sm:text-2xl ${
        isLowTime 
          ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 animate-pulse' 
          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
      }`}>
        {formatTime(seconds)}
      </div>
      {showWarning && isLowTime && (
        <span className="text-sm text-red-600 font-bold flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Time running out!
        </span>
      )}
    </div>
  );
};

TimerComponent.displayName = 'Timer';

export const Timer = memo(TimerComponent);
