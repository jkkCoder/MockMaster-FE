// Auth Types
export interface LoginDto {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  fullName: string;
  mail: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  mail: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Mock Types
export interface SectionResponseDto {
  id: string;
  name: string;
  sortOrder: number;
}

export interface MockWithSectionsDto {
  id: string;
  title: string;
  description?: string;
  duration: number;
  isActive: boolean;
  createdAt: string;
  sections: SectionResponseDto[];
}

export interface FetchMocksResponseDto {
  mocks: MockWithSectionsDto[];
}

// Test Types
export interface OptionResponseDto {
  id: string;
  label: string;
  text?: string;
  imageUrl?: string;
  sortOrder: number;
  isCorrect?: boolean; // Optional for backward compatibility
}

export interface QuestionResponseDto {
  id: string;
  text?: string;
  imageUrl?: string;
  marks: number;
  negativeMark: number;
  sortOrder: number;
  sectionId?: string;
  options: OptionResponseDto[];
}

export interface SectionWithQuestionsDto {
  id: string;
  name: string;
  sortOrder: number;
  questions: QuestionResponseDto[];
}

export interface StartAttemptResponseDto {
  attemptId: string;
  mockId: string;
  title: string;
  description?: string;
  duration: number;
  startedAt: string;
  sections: SectionWithQuestionsDto[];
}

export interface AnswerSubmissionDto {
  questionId: string;
  selectedOptionId?: string | null;
}

export interface SubmitAttemptDto {
  attemptId: string;
  answers: AnswerSubmissionDto[];
  timeTaken?: number;
}

export interface SectionWiseResultDto {
  sectionId: string;
  sectionName: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
}

export interface SubmitAttemptResponseDto {
  attemptId: string;
  mockId: string;
  title: string;
  status: 'SUBMITTED';
  score: number;
  percentage: number;
  totalMarks: number;
  obtainedMarks: number;
  timeTaken: number;
  submittedAt: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  sectionWiseResults: SectionWiseResultDto[];
}

// View Answers Types
export interface ViewAnswersResponseDto {
  mockId: string;
  title: string;
  description?: string;
  duration: number;
  sections: SectionWithQuestionsDto[]; // Uses same structure but options have isCorrect: true
}

// User Attempts Types
export interface SectionWiseResultSummaryDto {
  sectionId: string;
  sectionName: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
}

export interface UserAttemptSummaryDto {
  id: string;
  mockId: string;
  mockTitle: string;
  startedAt: string;
  submittedAt: string | null;
  score: number | null;
  percentage: number | null;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED';
  totalMarks: number;
  obtainedMarks: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  sectionWiseResults: SectionWiseResultSummaryDto[];
}

export interface UserAttemptsResponseDto {
  attempts: UserAttemptSummaryDto[];
}

// Attempt Details Types
export interface QuestionWithUserAnswerDto {
  id: string;
  text?: string;
  imageUrl?: string;
  marks: number;
  negativeMark: number;
  sortOrder: number;
  sectionId?: string;
  userSelectedOptionId?: string | null;
  correctOptionId?: string | null;
  isCorrect: boolean;
  options: OptionResponseDto[];
}

export interface SectionWithUserAnswersDto {
  id: string;
  name: string;
  sortOrder: number;
  questions: QuestionWithUserAnswerDto[];
}

export interface AttemptDetailsResponseDto {
  attemptId: string;
  mockId: string;
  title: string;
  description?: string;
  duration: number;
  startedAt: string;
  submittedAt?: string | null;
  timeTaken?: number | null;
  score?: number | null;
  percentage?: number | null;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED';
  totalMarks: number;
  obtainedMarks: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  sections: SectionWithUserAnswersDto[];
  sectionWiseResults: SectionWiseResultSummaryDto[];
}
