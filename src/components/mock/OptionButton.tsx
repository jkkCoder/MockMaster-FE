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
      className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md shadow-blue-200/50'
          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${
            isSelected
              ? 'border-blue-600 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md'
              : 'border-gray-300 bg-white'
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
          <span className="font-bold text-gray-900 mr-2 text-lg">{option.label}.</span>
          {option.text && <span className="text-gray-700 whitespace-pre-line leading-relaxed">{option.text}</span>}
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
