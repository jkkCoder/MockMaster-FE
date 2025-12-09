import React from 'react';
import type { SectionWiseResultDto } from '../../utils/types';
import { Card } from '../common/Card';

interface ResultsCardProps {
  sectionResult: SectionWiseResultDto;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ sectionResult }) => {
  const percentageColor =
    sectionResult.percentage >= 70
      ? 'text-green-600'
      : sectionResult.percentage >= 50
      ? 'text-yellow-600'
      : 'text-red-600';

  const progressColor =
    sectionResult.percentage >= 70
      ? 'bg-green-500'
      : sectionResult.percentage >= 50
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{sectionResult.sectionName}</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Score</span>
          <span className="font-semibold">
            {sectionResult.obtainedMarks.toFixed(2)} / {sectionResult.totalMarks}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Percentage</span>
          <span className={`font-bold ${percentageColor}`}>
            {sectionResult.percentage.toFixed(2)}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${progressColor}`}
            style={{ width: `${Math.min(sectionResult.percentage, 100)}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div>
            <span className="text-sm text-gray-500">Total Questions</span>
            <p className="text-lg font-semibold">{sectionResult.totalQuestions}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Answered</span>
            <p className="text-lg font-semibold">{sectionResult.answeredQuestions}</p>
          </div>
          <div>
            <span className="text-sm text-green-600">Correct</span>
            <p className="text-lg font-semibold text-green-600">{sectionResult.correctAnswers}</p>
          </div>
          <div>
            <span className="text-sm text-red-600">Incorrect</span>
            <p className="text-lg font-semibold text-red-600">{sectionResult.incorrectAnswers}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
