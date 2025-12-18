import type { StartAttemptResponseDto } from './types';

export interface SavedTestAttempt {
  attemptId: string;
  mockId: string;
  attempt: StartAttemptResponseDto; // Full attempt data
  answers: Record<string, string | null>; // questionId -> optionId
  startTime: number; // timestamp in milliseconds
  duration: number; // duration in minutes
  // Note: timer is calculated on-the-fly from startTime and duration, not stored
}

const STORAGE_PREFIX = 'test_attempt_';

/**
 * Get the storage key for a specific mock
 */
const getStorageKey = (mockId: string): string => {
  return `${STORAGE_PREFIX}${mockId}`;
};

/**
 * Save test attempt data to localStorage
 * Only stores startTime and duration - timer is calculated on-the-fly
 */
export const saveTestAttempt = (
  mockId: string,
  attempt: StartAttemptResponseDto,
  answers: Record<string, string | null>
): void => {
  try {
    const savedAttempt: SavedTestAttempt = {
      attemptId: attempt.attemptId,
      mockId: attempt.mockId,
      attempt, // Store full attempt data
      answers,
      startTime: new Date(attempt.startedAt).getTime(),
      duration: attempt.duration,
    };
    localStorage.setItem(getStorageKey(mockId), JSON.stringify(savedAttempt));
  } catch (error) {
    console.error('Failed to save test attempt to localStorage:', error);
  }
};

/**
 * Update only the answers for an existing test attempt
 */
export const updateTestAnswers = (mockId: string, answers: Record<string, string | null>): void => {
  try {
    const saved = getSavedTestAttempt(mockId);
    if (saved) {
      saved.answers = answers;
      localStorage.setItem(getStorageKey(mockId), JSON.stringify(saved));
    }
  } catch (error) {
    console.error('Failed to update test answers in localStorage:', error);
  }
};

/**
 * Calculate remaining time in seconds based on startTime and duration
 * This is calculated on-the-fly, not stored in localStorage
 */
export const calculateRemainingTime = (startTime: number, duration: number): number => {
  const now = Date.now();
  const elapsedTime = (now - startTime) / 1000; // elapsed time in seconds
  const totalDurationSeconds = duration * 60; // duration in seconds
  const remaining = totalDurationSeconds - elapsedTime;
  return Math.max(0, Math.floor(remaining));
};

/**
 * Get saved test attempt from localStorage
 */
export const getSavedTestAttempt = (mockId: string): SavedTestAttempt | null => {
  try {
    const data = localStorage.getItem(getStorageKey(mockId));
    if (!data) return null;
    return JSON.parse(data) as SavedTestAttempt;
  } catch (error) {
    console.error('Failed to get saved test attempt from localStorage:', error);
    return null;
  }
};

/**
 * Check if there's a valid saved attempt (within duration)
 */
export const hasValidSavedAttempt = (mockId: string): boolean => {
  const saved = getSavedTestAttempt(mockId);
  if (!saved) return false;

  const now = Date.now();
  const elapsedTime = (now - saved.startTime) / 1000 / 60; // elapsed time in minutes
  const remainingTime = saved.duration - elapsedTime;

  // Valid if there's still time remaining (at least 1 second)
  return remainingTime > 0;
};

/**
 * Get remaining time in seconds for a saved attempt
 * Calculated on-the-fly from startTime and duration
 */
export const getRemainingTime = (mockId: string): number | null => {
  const saved = getSavedTestAttempt(mockId);
  if (!saved) return null;

  return calculateRemainingTime(saved.startTime, saved.duration);
};

/**
 * Clear saved test attempt from localStorage
 */
export const clearSavedTestAttempt = (mockId: string): void => {
  try {
    localStorage.removeItem(getStorageKey(mockId));
  } catch (error) {
    console.error('Failed to clear saved test attempt from localStorage:', error);
  }
};

/**
 * Clear all saved test attempts (useful for cleanup)
 */
export const clearAllSavedTestAttempts = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear all saved test attempts from localStorage:', error);
  }
};
