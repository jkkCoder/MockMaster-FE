import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { resetTest } from '../store/slices/testSlice';
import { ResultsCard } from '../components/mock/ResultsCard';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import type { SubmitAttemptResponseDto } from '../utils/types';

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { results } = useAppSelector((state) => state.test);

  const resultsData: SubmitAttemptResponseDto | null =
    location.state?.results || results;

  useEffect(() => {
    if (!resultsData) {
      navigate('/');
    }
  }, [resultsData, navigate]);

  const handleBackToHome = () => {
    dispatch(resetTest());
    navigate('/');
  };

  if (!resultsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">No results found</p>
          <Button onClick={handleBackToHome}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const percentageColor =
    resultsData.percentage >= 70
      ? 'text-green-600'
      : resultsData.percentage >= 50
      ? 'text-yellow-600'
      : 'text-red-600';

  const progressColor =
    resultsData.percentage >= 70
      ? 'bg-green-500'
      : resultsData.percentage >= 50
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="outline" onClick={handleBackToHome} className="mb-6">
          ← Back to Home
        </Button>

        <Card className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{resultsData.title}</h1>
          <p className="text-gray-600 mb-6">Test Results</p>

          {/* Overall Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <span className="text-sm text-gray-500">Score</span>
              <p className="text-2xl font-bold text-gray-900">
                {resultsData.score.toFixed(2)} / {resultsData.totalMarks}
              </p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-500">Percentage</span>
              <p className={`text-2xl font-bold ${percentageColor}`}>
                {resultsData.percentage.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-500">Time Taken</span>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(resultsData.timeTaken / 60)}m {resultsData.timeTaken % 60}s
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className={`h-4 rounded-full ${progressColor}`}
              style={{ width: `${Math.min(resultsData.percentage, 100)}%` }}
            ></div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <span className="text-sm text-gray-500">Total Questions</span>
              <p className="text-lg font-semibold">{resultsData.totalQuestions}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-500">Answered</span>
              <p className="text-lg font-semibold">{resultsData.answeredQuestions}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-green-600">Correct</span>
              <p className="text-lg font-semibold text-green-600">{resultsData.correctAnswers}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-red-600">Incorrect</span>
              <p className="text-lg font-semibold text-red-600">{resultsData.incorrectAnswers}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-500">Unanswered</span>
              <p className="text-lg font-semibold">{resultsData.unansweredQuestions}</p>
            </div>
          </div>
        </Card>

        {/* Section-wise Results */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Section-wise Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resultsData.sectionWiseResults.map((sectionResult) => (
            <ResultsCard key={sectionResult.sectionId} sectionResult={sectionResult} />
          ))}
        </div>
      </div>
    </div>
  );
};
