import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAnswer, updateTimer, submitTest, restoreTestFromStorageByAttemptId } from '../store/slices/testSlice';
import { calculateRemainingTime } from '../utils/testStorage';
import { QuestionCard } from '../components/mock/QuestionCard';
import { QuestionNavigation } from '../components/mock/QuestionNavigation';
import { Timer } from '../components/common/Timer';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { getAnsweredCount } from '../utils/helpers';
import type { QuestionResponseDto } from '../utils/types';

export const TestPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentAttempt, answers, timer, isTestActive, loading } = useAppSelector(
    (state) => state.test
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const warningShownRef = useRef(false);
  const hasRestoredRef = useRef(false);

  // Restore test state from localStorage on mount if available
  useEffect(() => {
    if (attemptId && !currentAttempt && !hasRestoredRef.current) {
      hasRestoredRef.current = true;
      // Try to restore from localStorage
      dispatch(restoreTestFromStorageByAttemptId({ attemptId }));
      
      // If still no attempt after restore, try to start a new test
      // This handles the case where localStorage doesn't have the data
      // Note: This might not work if the backend doesn't allow starting a test
      // that's already in progress. In that case, we'd need a different API endpoint.
    }
  }, [attemptId, currentAttempt, dispatch]);

  // Get all questions in a flat array with section info
  const allQuestions: QuestionResponseDto[] = currentAttempt
    ? currentAttempt.sections.flatMap((section) => section.questions)
    : [];

  // Create a map of question index to section info
  const questionToSectionMap = new Map<number, { id: string; name: string }>();
  if (currentAttempt) {
    let questionIndex = 0;
    currentAttempt.sections.forEach((section) => {
      section.questions.forEach(() => {
        questionToSectionMap.set(questionIndex, { id: section.id, name: section.name });
        questionIndex++;
      });
    });
  }

  const currentQuestion = allQuestions[currentQuestionIndex];
  const currentSection = questionToSectionMap.get(currentQuestionIndex);
  const totalQuestions = allQuestions.length;
  const answeredCount = getAnsweredCount(answers);


  // Timer effect - calculate remaining time from startTime and duration
  useEffect(() => {
    if (!isTestActive || !currentAttempt) return;

    const startTime = new Date(currentAttempt.startedAt).getTime();
    const duration = currentAttempt.duration;

    const interval = setInterval(() => {
      // Calculate remaining time on-the-fly from startTime and duration
      const remaining = calculateRemainingTime(startTime, duration);

      if (remaining <= 0) {
        // Auto-submit when time expires
        if (attemptId) {
          const answerArray = allQuestions.map((q) => ({
            questionId: q.id,
            selectedOptionId: answers[q.id] || null,
          }));

          dispatch(
            submitTest({
              attemptId,
              answers: answerArray,
              timeTaken: duration * 60,
            })
          ).then((result: any) => {
            if (result.type.includes('fulfilled')) {
              navigate('/results', { state: { results: result.payload } });
            }
          });
        }
        dispatch(updateTimer(0));
        return;
      }

      dispatch(updateTimer(remaining));

      // Show warning at 5 minutes (300 seconds) - only once
      if (remaining === 300 && !warningShownRef.current) {
        warningShownRef.current = true;
        setShowTimeWarning(true);
        alert('Warning: Only 5 minutes remaining!');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTestActive, currentAttempt, dispatch, attemptId, navigate, allQuestions, answers]);


  const handleSelectOption = (optionId: string | null) => {
    if (!currentQuestion) return;
    dispatch(selectAnswer({ questionId: currentQuestion.id, optionId }));
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowMobileNav(false); // Close mobile nav after selection
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const handleSubmitConfirm = async () => {
    if (!currentAttempt || !attemptId) return;

    setShowSubmitModal(false);

    const answerArray = allQuestions.map((q) => ({
      questionId: q.id,
      selectedOptionId: answers[q.id] || null,
    }));

    try {
      const result = await dispatch(
        submitTest({
          attemptId,
          answers: answerArray,
          timeTaken: currentAttempt.duration * 60 - timer,
        })
      ).unwrap();
      navigate('/results', { state: { results: result } });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit test. Please try again.');
    }
  };

  const handleSubmitCancel = () => {
    setShowSubmitModal(false);
  };

  if (loading && !currentAttempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentAttempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Test not found</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Header with Timer */}
      <div className="bg-white/80 backdrop-blur-xl shadow-xl sticky top-0 z-20 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{currentAttempt.title}</h1>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200">
                  <p className="text-xs sm:text-sm font-semibold text-blue-700">
                    {answeredCount} / {totalQuestions} answered
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Timer seconds={timer} showWarning={showTimeWarning} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentQuestion && currentSection && (
              <>
                {/* Section Name Display - Desktop Only */}
                <div className="hidden lg:block bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border-l-4 border-blue-600 rounded-2xl p-5 mb-6 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">{currentSection.name}</h2>
                  </div>
                </div>
                <QuestionCard
                  question={currentQuestion}
                  selectedOptionId={answers[currentQuestion.id]}
                  onSelectOption={handleSelectOption}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={totalQuestions}
                  sectionName={currentSection.name}
                />
              </>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex-1 sm:flex-none"
              >
                ← Previous
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="flex-1 sm:flex-none"
              >
                Next →
              </Button>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-center">
              <Button variant="danger" size="lg" onClick={handleSubmitClick} isLoading={loading} className="w-full sm:w-auto">
                Submit Test
              </Button>
            </div>
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <QuestionNavigation
              questions={allQuestions}
              sections={currentAttempt?.sections || []}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              onQuestionClick={handleQuestionClick}
            />
          </div>
        </div>
      </div>

      {/* Mobile Question Navigation Button */}
      <button
        onClick={() => setShowMobileNav(true)}
        className="lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl shadow-blue-500/50 hover:shadow-3xl hover:shadow-blue-500/60 active:scale-95 transition-all duration-200 flex items-center justify-center z-30"
        aria-label="View all questions"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </button>

      {/* Mobile Navigation Modal */}
      {showMobileNav && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileNav(false)}
          />
          {/* Modal Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col border-t border-gray-200/50">
            <div className="flex items-center justify-between p-5 border-b border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">All Questions</h3>
              </div>
              <button
                onClick={() => setShowMobileNav(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <QuestionNavigation
                questions={allQuestions}
                sections={currentAttempt?.sections || []}
                currentQuestionIndex={currentQuestionIndex}
                answers={answers}
                onQuestionClick={handleQuestionClick}
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      <ConfirmModal
        isOpen={showSubmitModal}
        title="Submit Test"
        message={
          totalQuestions - answeredCount > 0
            ? `You have ${totalQuestions - answeredCount} unanswered question(s).\n\nAre you sure you want to submit your test? This action cannot be undone.`
            : 'Are you sure you want to submit your test? This action cannot be undone.'
        }
        confirmText="Submit Test"
        cancelText="Cancel"
        onConfirm={handleSubmitConfirm}
        onCancel={handleSubmitCancel}
        variant="danger"
      />
    </div>
  );
};
