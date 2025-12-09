import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAnswer, updateTimer, submitTest } from '../store/slices/testSlice';
import { QuestionCard } from '../components/mock/QuestionCard';
import { QuestionNavigation } from '../components/mock/QuestionNavigation';
import { Timer } from '../components/common/Timer';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { getTotalQuestions, getAnsweredCount } from '../utils/helpers';
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
  const warningShownRef = useRef(false);

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


  // Timer effect
  useEffect(() => {
    if (!isTestActive) return;

    let currentTimerValue = timer;

    const interval = setInterval(() => {
      currentTimerValue -= 1;

      if (currentTimerValue <= 0) {
        // Auto-submit when time expires
        if (currentAttempt && attemptId) {
          const answerArray = allQuestions.map((q) => ({
            questionId: q.id,
            selectedOptionId: answers[q.id] || null,
          }));

          dispatch(
            submitTest({
              attemptId,
              answers: answerArray,
              timeTaken: currentAttempt.duration * 60,
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

      dispatch(updateTimer(currentTimerValue));

      // Show warning at 5 minutes (300 seconds) - only once
      if (currentTimerValue === 300 && !warningShownRef.current) {
        warningShownRef.current = true;
        setShowTimeWarning(true);
        alert('Warning: Only 5 minutes remaining!');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTestActive, timer, dispatch, attemptId, navigate, currentAttempt, allQuestions, answers]);


  const handleSelectOption = (optionId: string | null) => {
    if (!currentQuestion) return;
    dispatch(selectAnswer({ questionId: currentQuestion.id, optionId }));
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{currentAttempt.title}</h1>
              <p className="text-sm text-gray-500">
                {answeredCount} of {totalQuestions} answered
              </p>
            </div>
            <Timer seconds={timer} showWarning={showTimeWarning} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentQuestion && currentSection && (
              <>
                {/* Section Name Display */}
                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 mb-4">
                  <h2 className="text-lg font-semibold text-blue-900">{currentSection.name}</h2>
                </div>
                <QuestionCard
                  question={currentQuestion}
                  selectedOptionId={answers[currentQuestion.id]}
                  onSelectOption={handleSelectOption}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={totalQuestions}
                />
              </>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={currentQuestionIndex === totalQuestions - 1}
              >
                Next →
              </Button>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-center">
              <Button variant="danger" size="lg" onClick={handleSubmitClick} isLoading={loading}>
                Submit Test
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
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
