import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { StartAttemptResponseDto, SubmitAttemptDto, SubmitAttemptResponseDto } from '../../utils/types';
import { mockService } from '../../services/mock.service';
import {
  saveTestAttempt,
  updateTestAnswers,
  clearSavedTestAttempt,
  getSavedTestAttempt,
  getRemainingTime,
  type SavedTestAttempt,
} from '../../utils/testStorage';

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
      // Save to localStorage if test is active
      if (state.currentAttempt && state.isTestActive) {
        updateTestAnswers(state.currentAttempt.mockId, state.answers);
      }
    },
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timer = action.payload;
      if (state.timer <= 0) {
        state.isTestActive = false;
      }
      // Note: Timer is calculated on-the-fly from startTime and duration
      // No need to save to localStorage every second
    },
    restoreTestFromStorage: (state, action: PayloadAction<{ mockId: string }>) => {
      const saved = getSavedTestAttempt(action.payload.mockId);
      if (saved) {
        // Restore full attempt data
        state.currentAttempt = saved.attempt;
        // Restore answers
        state.answers = saved.answers;
        // Calculate remaining time
        const remaining = getRemainingTime(action.payload.mockId);
        if (remaining !== null && remaining > 0) {
          state.timer = remaining;
          state.isTestActive = true;
        } else {
          state.timer = 0;
          state.isTestActive = false;
        }
      }
    },
    restoreTestFromStorageByAttemptId: (state, action: PayloadAction<{ attemptId: string }>) => {
      // Find saved attempt by attemptId (search all localStorage keys)
      try {
        const keys = Object.keys(localStorage);
        const prefix = 'test_attempt_';
        for (const key of keys) {
          if (key.startsWith(prefix)) {
            const data = localStorage.getItem(key);
            if (data) {
              const saved: SavedTestAttempt = JSON.parse(data);
              if (saved.attemptId === action.payload.attemptId) {
                // Restore full attempt data
                state.currentAttempt = saved.attempt;
                // Restore answers
                state.answers = saved.answers;
                // Calculate remaining time based on elapsed time
                const remaining = getRemainingTime(saved.mockId);
                if (remaining !== null && remaining > 0) {
                  state.timer = remaining;
                  state.isTestActive = true;
                } else {
                  state.timer = 0;
                  state.isTestActive = false;
                }
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to restore test from storage by attemptId:', error);
      }
    },
    resetTest: (state) => {
      // Clear localStorage if there's a current attempt
      if (state.currentAttempt) {
        clearSavedTestAttempt(state.currentAttempt.mockId);
      }
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
        // Save to localStorage (only startTime and duration, timer calculated on-the-fly)
        saveTestAttempt(action.payload.mockId, action.payload, state.answers);
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
        // Clear localStorage after successful submission
        if (state.currentAttempt) {
          clearSavedTestAttempt(state.currentAttempt.mockId);
        }
      })
      .addCase(submitTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit test';
      });
  },
});

export const { selectAnswer, updateTimer, restoreTestFromStorage, restoreTestFromStorageByAttemptId, resetTest, clearError } = testSlice.actions;
export default testSlice.reducer;
