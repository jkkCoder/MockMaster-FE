import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { StartAttemptResponseDto, SubmitAttemptDto, SubmitAttemptResponseDto } from '../../utils/types';
import { mockService } from '../../services/mock.service';

interface TestState {
  currentAttempt: StartAttemptResponseDto | null;
  answers: Record<string, string | null>; // questionId -> optionId
  timer: number; // in seconds
  isTestActive: boolean;
  results: SubmitAttemptResponseDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: TestState = {
  currentAttempt: null,
  answers: {},
  timer: 0,
  isTestActive: false,
  results: null,
  loading: false,
  error: null,
};

export const startTest = createAsyncThunk(
  'test/startTest',
  async (mockId: string) => {
    const response = await mockService.startAttempt(mockId);
    return response;
  }
);

export const submitTest = createAsyncThunk(
  'test/submitTest',
  async (data: SubmitAttemptDto) => {
    const response = await mockService.submitAttempt(data);
    return response;
  }
);

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    selectAnswer: (state, action: PayloadAction<{ questionId: string; optionId: string | null }>) => {
      state.answers[action.payload.questionId] = action.payload.optionId;
    },
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timer = action.payload;
      if (state.timer <= 0) {
        state.isTestActive = false;
      }
    },
    resetTest: (state) => {
      state.currentAttempt = null;
      state.answers = {};
      state.timer = 0;
      state.isTestActive = false;
      state.results = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startTest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAttempt = action.payload;
        state.timer = action.payload.duration * 60; // Convert minutes to seconds
        state.isTestActive = true;
        state.answers = {};
      })
      .addCase(startTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to start test';
      })
      .addCase(submitTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitTest.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.isTestActive = false;
      })
      .addCase(submitTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit test';
      });
  },
});

export const { selectAnswer, updateTimer, resetTest, clearError } = testSlice.actions;
export default testSlice.reducer;
