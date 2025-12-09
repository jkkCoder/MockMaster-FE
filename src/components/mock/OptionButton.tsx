import React from 'react';
import type { OptionResponseDto } from '../../utils/types';
import { IMAGE_BASE_URL } from '../../utils/constants';

interface OptionButtonProps {
  option: OptionResponseDto;
  isSelected: boolean;
  onSelect: () => void;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isSelected
              ? 'border-blue-600 bg-blue-600'
              : 'border-gray-300'
          }`}
        >
          {isSelected && (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <span className="font-semibold text-gray-800 mr-2">{option.label}.</span>
          {option.text && <span className="text-gray-700 whitespace-pre-line">{option.text}</span>}
          {option.imageUrl && (
            <div className="mt-2">
              <img
                src={`${IMAGE_BASE_URL}${option.imageUrl}`}
                alt={`Option ${option.label}`}
                className="max-w-full h-auto rounded"
              />
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
