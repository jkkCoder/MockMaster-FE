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
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {question.marks} mark{question.marks !== 1 ? 's' : ''}
          </span>
          {question.negativeMark > 0 && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              -{question.negativeMark} for wrong
            </span>
          )}
        </div>
      </div>

      {question.text && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4 whitespace-pre-line">{question.text}</h3>
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
