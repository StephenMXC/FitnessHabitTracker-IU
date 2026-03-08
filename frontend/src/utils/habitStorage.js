// localStorage utilities for habits data persistence

const STORAGE_KEYS = {
  HABITS: 'fitnessTracker_habits',
  PERCENTAGES: 'fitnessTracker_percentages',
  STREAK: 'fitnessTracker_streak',
  LAST_STREAK_TIMESTAMP: 'fitnessTracker_lastStreakTimestamp',
};

// Helper to strip base64 images if storage is full, keeping only essential data
const compressHabitForStorage = (habit) => {
  if (!habit) return habit;
  
  // Check if image is a base64 data URL (starts with 'data:')
  // If so, we store it as-is, but if localStorage is full, we might skip it
  return {
    ...habit,
    // Keep image but it will be managed by backend primarily
  };
};

export const saveToLocalStorage = (habits, percentages, streak, lastStreakTimestamp) => {
  try {
    const habitsToStore = habits ? habits.map(compressHabitForStorage) : [];
    
    // Try to save everything
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habitsToStore));
    localStorage.setItem(STORAGE_KEYS.PERCENTAGES, JSON.stringify(percentages));
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
    localStorage.setItem(STORAGE_KEYS.LAST_STREAK_TIMESTAMP, JSON.stringify(lastStreakTimestamp));
  } catch (err) {
    // If quota exceeded, try removing images and saving metadata only
    if (err.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Saving without images.');
      try {
        // Store habits without base64 images
        const habitsWithoutImages = habits ? habits.map(h => ({
          ...h,
          image: h.image && (h.image.startsWith('data:') ? null : h.image)
        })) : [];
        
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habitsWithoutImages));
        localStorage.setItem(STORAGE_KEYS.PERCENTAGES, JSON.stringify(percentages));
        localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
        localStorage.setItem(STORAGE_KEYS.LAST_STREAK_TIMESTAMP, JSON.stringify(lastStreakTimestamp));
      } catch (innerErr) {
        console.error('Failed to save to localStorage:', innerErr);
      }
    } else {
      console.error('Failed to save to localStorage:', err);
    }
  }
};

export const loadFromLocalStorage = () => {
  try {
    const habits = localStorage.getItem(STORAGE_KEYS.HABITS);
    const percentagesData = localStorage.getItem(STORAGE_KEYS.PERCENTAGES);
    const streakData = localStorage.getItem(STORAGE_KEYS.STREAK);
    const timestampData = localStorage.getItem(STORAGE_KEYS.LAST_STREAK_TIMESTAMP);

    return {
      habits: habits ? JSON.parse(habits) : null,
      percentages: percentagesData ? JSON.parse(percentagesData) : {},
      streak: streakData ? JSON.parse(streakData) : 0,
      lastStreakTimestamp: timestampData ? JSON.parse(timestampData) : null,
    };
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
    return {
      habits: null,
      percentages: {},
      streak: 0,
      lastStreakTimestamp: null,
    };
  }
};

export const clearHabitStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
};
