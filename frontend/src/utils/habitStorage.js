// ============================================
// HABIT LOCAL STORAGE UTILITY
// ============================================
// PURPOSE: Persist habit data locally for offline access and performance.
// FEATURES:
// - Save habits, percentages, streaks, completion dates to localStorage
// - Load persisted data on app restart
// - Handle storage quota errors gracefully
// - Per-user storage keys (multiple users can use same browser)
// ============================================

// Create user-specific storage keys to support multiple users on same browser
const getStorageKeys = (userId) => ({
  HABITS: `fitnessTracker_habits_${userId}`,
  PERCENTAGES: `fitnessTracker_percentages_${userId}`,
  STREAK: `fitnessTracker_streak_${userId}`,
  LAST_STREAK_TIMESTAMP: `fitnessTracker_lastStreakTimestamp_${userId}`,
  COMPLETED_DAYS: `fitnessTracker_completedDays_${userId}`,
  LAST_INCREMENT_DATE: `fitnessTracker_lastIncrementDate_${userId}`,
});

// Helper to reduce data size if localStorage is full
const compressHabitForStorage = (habit) => {
  if (!habit) return habit;
  // Keep essential data, will remove base64 images if storage full
  return { ...habit };
};

// SAVE DATA: Store all habit-related state to localStorage for persistence
export const saveToLocalStorage = (habits, percentages, streak, lastStreakTimestamp, completedDays, lastIncrementDate, userId) => {
  try {
    const STORAGE_KEYS = getStorageKeys(userId);
    const habitsToStore = habits ? habits.map(compressHabitForStorage) : [];
    
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habitsToStore));
    localStorage.setItem(STORAGE_KEYS.PERCENTAGES, JSON.stringify(percentages));
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
    localStorage.setItem(STORAGE_KEYS.LAST_STREAK_TIMESTAMP, JSON.stringify(lastStreakTimestamp));
    localStorage.setItem(STORAGE_KEYS.COMPLETED_DAYS, JSON.stringify(completedDays));
    localStorage.setItem(STORAGE_KEYS.LAST_INCREMENT_DATE, JSON.stringify(lastIncrementDate));
  } catch (err) {
    // localStorage quota exceeded - remove images and retry
    if (err.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Saving without images.');
      try {
        const STORAGE_KEYS = getStorageKeys(userId);
        const habitsWithoutImages = habits ? habits.map(h => ({
          ...h,
          image: h.image && (h.image.startsWith('data:') ? null : h.image)
        })) : [];
        
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habitsWithoutImages));
        localStorage.setItem(STORAGE_KEYS.PERCENTAGES, JSON.stringify(percentages));
        localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
        localStorage.setItem(STORAGE_KEYS.LAST_STREAK_TIMESTAMP, JSON.stringify(lastStreakTimestamp));
        localStorage.setItem(STORAGE_KEYS.COMPLETED_DAYS, JSON.stringify(completedDays));
        localStorage.setItem(STORAGE_KEYS.LAST_INCREMENT_DATE, JSON.stringify(lastIncrementDate));
      } catch (innerErr) {
        console.error('Failed to save to localStorage:', innerErr);
      }
    } else {
      console.error('Failed to save to localStorage:', err);
    }
  }
};

// LOAD DATA: Retrieve persisted habit data from localStorage
export const loadFromLocalStorage = (userId) => {
  try {
    const STORAGE_KEYS = getStorageKeys(userId);
    const habits = localStorage.getItem(STORAGE_KEYS.HABITS);
    const percentagesData = localStorage.getItem(STORAGE_KEYS.PERCENTAGES);
    const streakData = localStorage.getItem(STORAGE_KEYS.STREAK);
    const timestampData = localStorage.getItem(STORAGE_KEYS.LAST_STREAK_TIMESTAMP);
    const completedDaysData = localStorage.getItem(STORAGE_KEYS.COMPLETED_DAYS);
    const incrementDateData = localStorage.getItem(STORAGE_KEYS.LAST_INCREMENT_DATE);
    const today = new Date().toISOString().split('T')[0];

    const parsedCompletedDays = completedDaysData ? JSON.parse(completedDaysData) : 0;
    const parsedLastIncrementDate = incrementDateData ? JSON.parse(incrementDateData) : null;
    const completedToday = parsedLastIncrementDate === today ? (parsedCompletedDays > 0 ? 1 : 0) : 0;

    return {
      habits: habits ? JSON.parse(habits) : null,
      percentages: percentagesData ? JSON.parse(percentagesData) : {},
      streak: streakData ? JSON.parse(streakData) : 0,
      lastStreakTimestamp: timestampData ? JSON.parse(timestampData) : null,
      completedDays: completedToday,
      completedToday,
      lastIncrementDate: parsedLastIncrementDate,
    };
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
    return {
      habits: null,
      percentages: {},
      streak: 0,
      lastStreakTimestamp: null,
      completedDays: 0,
      lastIncrementDate: null,
    };
  }
};

// CLEAR DATA: Remove all habit data for a user
export const clearHabitStorage = (userId) => {
  try {
    const STORAGE_KEYS = getStorageKeys(userId);
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
};
