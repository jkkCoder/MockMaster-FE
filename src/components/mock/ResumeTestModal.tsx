import React from 'react';
import { Button } from '../common/Button';

interface ResumeTestModalProps {
  isOpen: boolean;
  onResume: () => void;
  onStartNew: () => void;
  remainingTime: number; // in seconds
}

export const ResumeTestModal: React.FC<ResumeTestModalProps> = ({
  isOpen,
  onResume,
  onStartNew,
  remainingTime,
}) => {
  if (!isOpen) return null;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Resume Previous Test?</h3>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-gray-700 mb-4">
              You have an incomplete test attempt with <strong>{formatTime(remainingTime)}</strong> remaining.
            </p>
            <p className="text-gray-600 text-sm">
              Would you like to resume your previous test or start a new one?
            </p>
            <p className="text-gray-500 text-xs mt-2 italic">
              Note: Starting a new test will clear your previous attempt.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <Button variant="outline" onClick={onStartNew}>
              Start New Test
            </Button>
            <Button variant="primary" onClick={onResume}>
              Resume Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
