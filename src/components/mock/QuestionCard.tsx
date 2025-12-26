import React from 'react';
import type { QuestionResponseDto } from '../../utils/types';
import { OptionButton } from './OptionButton';
import { IMAGE_BASE_URL } from '../../utils/constants';

interface QuestionCardProps {
  question: QuestionResponseDto;
  selectedOptionId?: string | null;
  onSelectOption: (optionId: string | null) => void;
  questionNumber: number;
  totalQuestions: number;
  sectionName?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  questionNumber,
  totalQuestions,
  sectionName,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100/50">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {sectionName && (
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg shadow-md">
                {sectionName}
              </span>
            )}
            <span className="text-sm font-semibold text-gray-600">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200">
              {question.marks} mark{question.marks !== 1 ? 's' : ''}
            </span>
          {question.negativeMark > 0 && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              -{question.negativeMark} for wrong
            </span>
          )}
          </div>
        </div>
      </div>

      {question.text && (
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 leading-relaxed whitespace-pre-line">{question.text}</h3>
      )}

      {question.imageUrl && (
        <div className="mb-4">
          <img
            src={`${IMAGE_BASE_URL}${question.imageUrl}`}
            alt="Question"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}

      <div className="space-y-2">
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            isSelected={selectedOptionId === option.id}
            onSelect={() => onSelectOption(option.id)}
          />
        ))}
      </div>

      <button
        onClick={() => onSelectOption(null)}
        className="mt-4 text-sm text-gray-500 hover:text-gray-700"
      >
        Clear Selection
      </button>
    </div>
  );
};
