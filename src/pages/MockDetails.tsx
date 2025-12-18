import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMocks, setSelectedMock } from '../store/slices/mockSlice';
import { startTest, resetTest } from '../store/slices/testSlice';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Card } from '../components/common/Card';
import { ResumeTestModal } from '../components/mock/ResumeTestModal';
import { hasValidSavedAttempt, getRemainingTime, getSavedTestAttempt, clearSavedTestAttempt } from '../utils/testStorage';

export const MockDetails: React.FC = () => {
  const { mockId } = useParams<{ mockId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mocks, selectedMock, loading } = useAppSelector((state) => state.mock);
  const { loading: testLoading } = useAppSelector((state) => state.test);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (mocks.length === 0) {
      dispatch(fetchMocks());
    } else {
      const mock = mocks.find((m) => m.id === mockId);
      if (mock) {
        dispatch(setSelectedMock(mock));
      }
    }
  }, [mockId, mocks, dispatch]);

  useEffect(() => {
    if (mocks.length > 0 && !selectedMock) {
      const mock = mocks.find((m) => m.id === mockId);
      if (mock) {
        dispatch(setSelectedMock(mock));
      }
    }
  }, [mocks, mockId, selectedMock, dispatch]);

  const handleStartTest = async () => {
    if (!mockId) return;

    // Check if there's a valid saved attempt
    if (hasValidSavedAttempt(mockId)) {
      const remaining = getRemainingTime(mockId);
      if (remaining !== null && remaining > 0) {
        setRemainingTime(remaining);
        setShowResumeModal(true);
        return;
      }
    }

    // No valid saved attempt, start new test
    await startNewTest();
  };

  const startNewTest = async () => {
    if (!mockId) return;

    // Clear any existing saved attempt
    clearSavedTestAttempt(mockId);
    dispatch(resetTest());

    try {
      const result = await dispatch(startTest(mockId)).unwrap();
      navigate(`/test/${result.attemptId}`);
    } catch (error) {
      console.error('Failed to start test:', error);
    }
  };

  const handleResumeTest = async () => {
    if (!mockId) return;

    setShowResumeModal(false);
    const saved = getSavedTestAttempt(mockId);
    if (!saved) {
      // If saved data is invalid, start new test
      await startNewTest();
      return;
    }

    // Navigate to the saved attemptId - TestPage will restore state from localStorage
    navigate(`/test/${saved.attemptId}`);
  };

  const handleStartNewTest = async () => {
    setShowResumeModal(false);
    await startNewTest();
  };

  const handleViewAnswers = () => {
    if (!mockId) return;
    navigate(`/mock/${mockId}/answers`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!selectedMock) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Mock test not found</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="outline" onClick={() => navigate('/')} className="mb-6">
          ← Back to Home
        </Button>

        <Card>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedMock.title}</h1>
          
          {selectedMock.description && (
            <p className="text-gray-600 mb-6">{selectedMock.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <span className="text-sm text-gray-500">Duration</span>
              <p className="text-lg font-semibold">{selectedMock.duration} minutes</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Sections</span>
              <p className="text-lg font-semibold">{selectedMock.sections.length}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sections</h2>
            <div className="space-y-2">
              {selectedMock.sections.map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-800">
                    {index + 1}. {section.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleStartTest}
              isLoading={testLoading}
            >
              Start Test
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleViewAnswers}
            >
              View Answers
            </Button>
          </div>
        </Card>
      </div>

      {/* Resume Test Modal */}
      <ResumeTestModal
        isOpen={showResumeModal}
        onResume={handleResumeTest}
        onStartNew={handleStartNewTest}
        remainingTime={remainingTime}
      />
    </div>
  );
};
