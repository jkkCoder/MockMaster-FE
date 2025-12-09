import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockService } from '../services/mock.service';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import type { ViewAnswersResponseDto, QuestionResponseDto } from '../utils/types';
import { IMAGE_BASE_URL } from '../utils/constants';

export const ViewAnswers: React.FC = () => {
  const { mockId } = useParams<{ mockId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ViewAnswersResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const sectionContentRef = useRef<HTMLDivElement>(null);
  const previousSectionIdRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!mockId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await mockService.viewAnswers(mockId);
        setData(response);
        // Set first section as selected by default
        if (response.sections.length > 0) {
          setSelectedSectionId(response.sections[0].id);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load answers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [mockId]);

  const selectedSection = data?.sections.find((s) => s.id === selectedSectionId);

  // Scroll to top when section changes
  useEffect(() => {
    if (selectedSectionId && selectedSectionId !== previousSectionIdRef.current && sectionContentRef.current) {
      // Only scroll if it's a different section (not initial load)
      if (previousSectionIdRef.current !== null) {
        sectionContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      previousSectionIdRef.current = selectedSectionId;
    }
  }, [selectedSectionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Answers not found'}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{data.title}</h1>
              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                <span>Duration: {data.duration} min</span>
                <span>Sections: {data.sections.length}</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              ← Back
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile: Sections at Top */}
      <div className="lg:hidden bg-white shadow-md sticky top-[100px] z-20 border-b border-gray-200">
        <div className="px-4 py-3">
          <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Sections
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {data.sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setSelectedSectionId(section.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs transition-colors whitespace-nowrap ${
                  selectedSectionId === section.id
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-medium">S{index + 1}</div>
                <div className={`text-[10px] mt-0.5 ${
                  selectedSectionId === section.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {section.name.length > 15 ? `${section.name.substring(0, 15)}...` : section.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto relative">
        {/* Desktop: Left Sidebar - Sections (Sticky, Not Scrollable) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white shadow-md sticky top-[100px] z-10" style={{ maxHeight: 'calc(100vh - 100px)' }}>
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Sections
              </h2>
              <div className="space-y-1">
                {data.sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSectionId(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedSectionId === section.id
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">Section {index + 1}</div>
                    <div className={`text-xs mt-0.5 ${
                      selectedSectionId === section.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {section.name}
                    </div>
                    <div className={`text-xs mt-1 ${
                      selectedSectionId === section.id ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-4 sm:px-6 py-4 lg:py-6">
          {selectedSection ? (
            <div ref={sectionContentRef} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              {/* Section Header */}
              <div className="border-b-2 border-blue-600 pb-2 mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-blue-900">
                  {data.sections.findIndex((s) => s.id === selectedSection.id) + 1}. {selectedSection.name}
                </h2>
              </div>

              {/* Questions - Compact Layout */}
              <div className="space-y-5 sm:space-y-6">
                {selectedSection.questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="border-b border-gray-200 pb-4 sm:pb-5 last:border-b-0 last:pb-0"
                  >
                    {/* Question */}
                    <div className="mb-3">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-sm sm:text-base font-semibold text-gray-700 min-w-[28px] sm:min-w-[32px] flex-shrink-0">
                          Q{questionIndex + 1}.
                        </span>
                        <div className="flex-1 min-w-0">
                          {question.text && (
                            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-2 whitespace-pre-line">
                              {question.text}
                            </p>
                          )}
                          {question.imageUrl && (
                            <div className="mb-2">
                              <img
                                src={`${IMAGE_BASE_URL}${question.imageUrl}`}
                                alt="Question"
                                className="max-w-full h-auto rounded"
                              />
                            </div>
                          )}
                          <div className="flex gap-2 text-xs">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {question.marks} mark{question.marks !== 1 ? 's' : ''}
                            </span>
                            {question.negativeMark > 0 && (
                              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">
                                -{question.negativeMark}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Options - Compact */}
                    <div className="ml-6 sm:ml-8 space-y-1.5">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className={`p-2 rounded border ${
                            option.isCorrect
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className={`text-sm font-semibold min-w-[20px] flex-shrink-0 ${
                                option.isCorrect ? 'text-green-700' : 'text-gray-700'
                              }`}
                            >
                              {option.label}.
                            </span>
                            <div className="flex-1 min-w-0">
                              {option.text && (
                                <span
                                  className={`text-sm leading-relaxed whitespace-pre-line ${
                                    option.isCorrect
                                      ? 'font-bold text-green-800'
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {option.text}
                                </span>
                              )}
                              {option.imageUrl && (
                                <div className="mt-1.5">
                                  <img
                                    src={`${IMAGE_BASE_URL}${option.imageUrl}`}
                                    alt={`Option ${option.label}`}
                                    className="max-w-full h-auto rounded"
                                  />
                                </div>
                              )}
                            </div>
                            {option.isCorrect && (
                              <span className="text-green-600 font-semibold text-xs flex-shrink-0 ml-2">
                                ✓
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Section Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                End of {selectedSection.name}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
              Select a section to view questions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
