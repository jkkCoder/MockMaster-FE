import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../services/mock.service';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Card } from '../components/common/Card';
import type { UserAttemptSummaryDto } from '../utils/types';

export const MyAttempts: React.FC = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<UserAttemptSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await mockService.fetchUserAttempts();
        setAttempts(response.attempts);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load attempts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  const getPercentageColor = (percentage: number | null) => {
    if (percentage === null) return 'text-gray-500';
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Attempts</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
        </div>

        {attempts.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No attempts found</p>
              <p className="text-gray-400 mb-6">You haven't submitted any mock tests yet.</p>
              <Button variant="primary" onClick={() => navigate('/')}>
                Browse Mock Tests
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <Card key={attempt.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">{attempt.mockTitle}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        attempt.status === 'SUBMITTED' 
                          ? 'bg-green-100 text-green-800'
                          : attempt.status === 'AUTO_SUBMITTED'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {attempt.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Submitted on {attempt.submittedAt ? formatDate(attempt.submittedAt) : 'N/A'}
                    </p>

                    {/* Score Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <span className="text-xs text-gray-500">Score</span>
                        <p className="text-lg font-semibold text-gray-900">
                          {attempt.obtainedMarks.toFixed(2)} / {attempt.totalMarks}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Percentage</span>
                        <p className={`text-lg font-semibold ${getPercentageColor(attempt.percentage)}`}>
                          {attempt.percentage?.toFixed(2) || 'N/A'}%
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Correct</span>
                        <p className="text-lg font-semibold text-green-600">{attempt.correctAnswers}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Incorrect</span>
                        <p className="text-lg font-semibold text-red-600">{attempt.incorrectAnswers}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Unanswered</span>
                        <p className="text-lg font-semibold text-gray-600">{attempt.unansweredQuestions}</p>
                      </div>
                    </div>

                    {/* Section-wise Summary */}
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Section-wise Performance</h3>
                      <div className="flex flex-wrap gap-2">
                        {attempt.sectionWiseResults.map((section) => (
                          <div
                            key={section.sectionId}
                            className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs"
                          >
                            <span className="font-medium text-gray-700">{section.sectionName}:</span>
                            <span className={`ml-1 font-semibold ${
                              section.percentage >= 70 ? 'text-green-600' :
                              section.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {section.percentage.toFixed(1)}%
                            </span>
                            <span className="text-gray-500 ml-1">
                              ({section.correctAnswers}/{section.totalQuestions})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 lg:flex-col">
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/attempt/${attempt.id}/details`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

