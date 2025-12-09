import React from 'react';
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
    const endIndex = sectionQuestionMap.findLastIndex((item) => item.sectionId === section.id);
    return {
      ...section,
      startIndex,
      endIndex,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold text-gray-800 mb-4">Questions</h3>
      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
        {sectionsWithQuestions.map((section) => {
          const sectionQuestions = questions.slice(section.startIndex, section.endIndex + 1);
          const sectionStartIndex = section.startIndex;

          return (
            <div key={section.id} className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 sticky top-0 bg-white py-1">
                {section.name}
              </h4>
              <div className="grid grid-cols-10 gap-2">
                {sectionQuestions.map((question, localIndex) => {
                  const globalQuestionIndex = sectionStartIndex + localIndex;
                  const status = getQuestionStatus(question.id);
                  const isCurrent = globalQuestionIndex === currentQuestionIndex;

                  return (
                    <button
                      key={question.id}
                      onClick={() => onQuestionClick(globalQuestionIndex)}
                      className={`w-10 h-10 rounded-lg border-2 font-medium transition-all ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : status === 'answered'
                          ? 'border-green-500 bg-green-100 text-green-800'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
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
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 bg-blue-600 rounded"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-green-500 bg-green-100 rounded"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-300 bg-white rounded"></div>
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
};
