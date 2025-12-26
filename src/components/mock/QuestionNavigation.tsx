import React, { useState, useRef, useEffect } from 'react';
import type { QuestionResponseDto, SectionWithQuestionsDto } from '../../utils/types';

interface QuestionNavigationProps {
  questions: QuestionResponseDto[];
  sections: SectionWithQuestionsDto[];
  currentQuestionIndex: number;
  answers: Record<string, string | null>;
  onQuestionClick: (index: number) => void;
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  sections,
  currentQuestionIndex,
  answers,
  onQuestionClick,
}) => {
  const getQuestionStatus = (questionId: string) => {
    const answer = answers[questionId];
    if (answer !== null && answer !== undefined) {
      return 'answered';
    }
    return 'unanswered';
  };

  // Create a map of question index to global index
  const sectionQuestionMap: Array<{ sectionId: string; sectionName: string; questionIndex: number; globalIndex: number }> = [];
  let globalIndex = 0;
  sections.forEach((section) => {
    section.questions.forEach((_, questionIndex) => {
      sectionQuestionMap.push({
        sectionId: section.id,
        sectionName: section.name,
        questionIndex,
        globalIndex,
      });
      globalIndex++;
    });
  });

  // Group by section
  const sectionsWithQuestions = sections.map((section) => {
    const startIndex = sectionQuestionMap.findIndex((item) => item.sectionId === section.id);
    // Find last index manually since findLastIndex requires ES2023
    let endIndex = -1;
    for (let i = sectionQuestionMap.length - 1; i >= 0; i--) {
      if (sectionQuestionMap[i].sectionId === section.id) {
        endIndex = i;
        break;
      }
    }
    return {
      ...section,
      startIndex,
      endIndex,
    };
  });

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Find current section based on current question
  useEffect(() => {
    const currentSection = sectionsWithQuestions.find(
      (section) => currentQuestionIndex >= section.startIndex && currentQuestionIndex <= section.endIndex
    );
    if (currentSection && !selectedSectionId) {
      setSelectedSectionId(currentSection.id);
    }
  }, [currentQuestionIndex, sectionsWithQuestions, selectedSectionId]);

  const scrollToSection = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    const sectionElement = sectionRefs.current[sectionId];
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get current section
  const currentSection = sectionsWithQuestions.find(
    (section) => currentQuestionIndex >= section.startIndex && currentQuestionIndex <= section.endIndex
  );

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 lg:p-5 border border-gray-100/50">
      <div className="flex items-center gap-3 mb-4 lg:mb-5">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
          <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="font-bold text-base lg:text-lg text-gray-900">Questions</h3>
      </div>

      {/* Mobile Section Selector - Sticky at top */}
      <div className="lg:hidden sticky top-0 z-20 mb-4 pb-3 bg-white/95 backdrop-blur-sm -mx-4 px-4 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {sectionsWithQuestions.map((section, index) => {
            const isActive = selectedSectionId === section.id || (!selectedSectionId && section.id === currentSection?.id);
            const sectionQuestions = questions.slice(section.startIndex, section.endIndex + 1);
            const answeredCount = sectionQuestions.filter(q => getQuestionStatus(q.id) === 'answered').length;
            
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>S{index + 1}</span>
                  <span className="text-xs opacity-75">({answeredCount}/{sectionQuestions.length})</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 lg:space-y-5 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
        {sectionsWithQuestions.map((section) => {
          const sectionQuestions = questions.slice(section.startIndex, section.endIndex + 1);
          const sectionStartIndex = section.startIndex;
          const isCurrentSection = selectedSectionId === section.id || (!selectedSectionId && section.id === currentSection?.id);

          return (
            <div 
              key={section.id} 
              ref={(el) => {
                sectionRefs.current[section.id] = el;
              }}
              className="mb-4 lg:mb-5 scroll-mt-4"
            >
              <h4 className={`text-xs lg:text-sm font-semibold mb-2 lg:mb-3 py-2 px-3 rounded-xl ${
                isCurrentSection 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 border-2 border-blue-200' 
                  : 'text-gray-800 border-b border-gray-100'
              }`}>
                <div className="flex items-center justify-between">
                  <span>{section.name}</span>
                  <span className="text-xs font-normal opacity-75">
                    {sectionQuestions.filter(q => getQuestionStatus(q.id) === 'answered').length}/{sectionQuestions.length}
                  </span>
                </div>
              </h4>
              <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-1.5 lg:gap-2 auto-rows-fr">
                {sectionQuestions.map((question, localIndex) => {
                  const globalQuestionIndex = sectionStartIndex + localIndex;
                  const status = getQuestionStatus(question.id);
                  const isCurrent = globalQuestionIndex === currentQuestionIndex;

                  return (
                    <button
                      key={question.id}
                      onClick={() => onQuestionClick(globalQuestionIndex)}
                      className={`min-w-[2rem] sm:min-w-[2.25rem] lg:min-w-[2.5rem] w-full aspect-square rounded-xl border-2 font-bold text-xs sm:text-sm transition-all duration-200 active:scale-95 lg:hover:scale-110 ${
                        isCurrent
                          ? 'border-blue-600 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40 ring-2 ring-blue-200'
                          : status === 'answered'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 active:bg-emerald-100 lg:hover:bg-emerald-100 lg:hover:border-emerald-600 lg:hover:shadow-md'
                          : 'border-gray-300 bg-white text-gray-700 active:border-blue-400 active:bg-blue-50 lg:hover:border-blue-400 lg:hover:bg-blue-50 lg:hover:shadow-sm'
                      }`}
                      title={`Question ${globalQuestionIndex + 1}`}
                    >
                      {globalQuestionIndex + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 lg:mt-5 pt-3 lg:pt-4 border-t border-gray-200 flex flex-wrap items-center gap-3 lg:gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 lg:gap-2">
          <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-blue-600 bg-gradient-to-br from-blue-600 to-indigo-600 rounded shadow-sm"></div>
          <span className="text-gray-700 font-medium">Current</span>
        </div>
        <div className="flex items-center gap-1.5 lg:gap-2">
          <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-emerald-500 bg-emerald-50 rounded shadow-sm"></div>
          <span className="text-gray-700">Answered</span>
        </div>
        <div className="flex items-center gap-1.5 lg:gap-2">
          <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-gray-300 bg-white rounded shadow-sm"></div>
          <span className="text-gray-700">Unanswered</span>
        </div>
      </div>
    </div>
  );
};
