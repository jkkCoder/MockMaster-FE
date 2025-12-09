import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MockWithSectionsDto } from '../../utils/types';
import { mockService } from '../../services/mock.service';

interface MockState {
  mocks: MockWithSectionsDto[];
  selectedMock: MockWithSectionsDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: MockState = {
  mocks: [],
  selectedMock: null,
  loading: false,
  error: null,
};

export const fetchMocks = createAsyncThunk('mock/fetchMocks', async () => {
  const response = await mockService.fetchMocks();
  return response.mocks;
});

const mockSlice = createSlice({
  name: 'mock',
  initialState,
  reducers: {
    setSelectedMock: (state, action: PayloadAction<MockWithSectionsDto | null>) => {
      state.selectedMock = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMocks.fulfilled, (state, action) => {
        state.loading = false;
        state.mocks = action.payload;
      })
      .addCase(fetchMocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch mocks';
      });
  },
});

export const { setSelectedMock, clearError } = mockSlice.actions;
export default mockSlice.reducer;
