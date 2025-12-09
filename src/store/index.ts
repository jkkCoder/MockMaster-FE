import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mockReducer from './slices/mockSlice';
import testReducer from './slices/testSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mock: mockReducer,
    test: testReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
