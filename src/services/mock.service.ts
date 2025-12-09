import api from './api';
import type {
  FetchMocksResponseDto,
  StartAttemptResponseDto,
  SubmitAttemptDto,
  SubmitAttemptResponseDto,
  ViewAnswersResponseDto,
  UserAttemptsResponseDto,
  AttemptDetailsResponseDto,
} from '../utils/types';

export const mockService = {
  fetchMocks: async (): Promise<FetchMocksResponseDto> => {
    const response = await api.get<FetchMocksResponseDto>('/admin/mocks/fetch-mocks');
    return response.data;
  },

  startAttempt: async (mockId: string): Promise<StartAttemptResponseDto> => {
    const response = await api.post<StartAttemptResponseDto>('/admin/mocks/start-attempt', {
      mockId,
    });
    return response.data;
  },

  submitAttempt: async (data: SubmitAttemptDto): Promise<SubmitAttemptResponseDto> => {
    const response = await api.post<SubmitAttemptResponseDto>('/admin/mocks/submit-attempt', data);
    return response.data;
  },

  viewAnswers: async (mockId: string): Promise<ViewAnswersResponseDto> => {
    const response = await api.get<ViewAnswersResponseDto>(`/admin/mocks/view-answers/${mockId}`);
    return response.data;
  },

  fetchUserAttempts: async (): Promise<UserAttemptsResponseDto> => {
    const response = await api.get<UserAttemptsResponseDto>('/admin/mocks/my-attempts');
    return response.data;
  },

  fetchAttemptDetails: async (attemptId: string): Promise<AttemptDetailsResponseDto> => {
    const response = await api.get<AttemptDetailsResponseDto>(`/admin/mocks/attempt/${attemptId}/details`);
    return response.data;
  },
};
