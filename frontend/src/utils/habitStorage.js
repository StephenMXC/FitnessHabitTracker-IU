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

// === CREATE USER-SPECIFIC STORAGE KEYS ===
// localStorage is shared across all users on same browser
// We add userId to keys to keep each user's data separate
// Example: fitnessTracker_habits_5 (user 5's habits)
// This allows multiple users to use the same browser simultaneously
const getStorageKeys = (userId) => ({
  HABITS: `fitnessTracker_habits_${userId}`,                           // All habits for this user
  PERCENTAGES: `fitnessTracker_percentages_${userId}`,                 // Completion % for each habit
  STREAK: `fitnessTracker_streak_${userId}`,                           // Current streak count
  LAST_STREAK_TIMESTAMP: `fitnessTracker_lastStreakTimestamp_${userId}`, // When streak was last updated
  COMPLETED_DAYS: `fitnessTracker_completedDays_${userId}`,            // Days with 100% completion
  LAST_INCREMENT_DATE: `fitnessTracker_lastIncrementDate_${userId}`,   // Last date actions were recorded
});

// === COMPRESSION HELPER ===
// Prepares habit object for storage
// Currently just returns the habit unchanged
// Could be expanded to remove unnecessary properties if needed
const compressHabitForStorage = (habit) => {
  if (!habit) return habit;
  // Keep essential data; base64 images might be stripped if storage full
  return { ...habit };
};

// === SAVE DATA: Persist all habit state to localStorage ===
// Call this function whenever habit state changes to keep localStorage in sync
// If localStorage quota exceeded, automatically strips images and retries
export const saveToLocalStorage = (habits, percentages, streak, lastStreakTimestamp, completedDays, lastIncrementDate, userId) => {
  try {
    // Get user-specific storage keys
    const STORAGE_KEYS = getStorageKeys(userId);
    
    // Prepare habits for storage (compress if needed)
    const habitsToStore = habits ? habits.map(compressHabitForStorage) : [];
    
    // === STORE EACH DATA TYPE ===
    // Convert JavaScript objects to JSON strings for storage
    // localStorage only stores text/strings, not objects
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habitsToStore));
    localStorage.setItem(STORAGE_KEYS.PERCENTAGES, JSON.stringify(percentages));
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
    localStorage.setItem(STORAGE_KEYS.LAST_STREAK_TIMESTAMP, JSON.stringify(lastStreakTimestamp));
    localStorage.setItem(STORAGE_KEYS.COMPLETED_DAYS, JSON.stringify(completedDays));
    localStorage.setItem(STORAGE_KEYS.LAST_INCREMENT_DATE, JSON.stringify(lastIncrementDate));
  } catch (err) {
    // === HANDLE STORAGE QUOTA EXCEEDED ===
    // Browser localStorage has size limit (~5-10MB depending on browser)
    // Images stored as base64 take significant space
    // If quota exceeded, strip images and try again
    if (err.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Saving without images.');
      try {
        const STORAGE_KEYS = getStorageKeys(userId);
        
        // Remove base64 images (data:image/png;base64,...) from habits
        // Keep regular image URLs if they exist
        const habitsWithoutImages = habits ? habits.map(h => ({
          ...h,
          image: h.image && (h.image.startsWith('data:') ? null : h.image)
        })) : [];
        
        // Try saving again without images
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habitsWithoutImages));
        localStorage.setItem(STORAGE_KEYS.PERCENTAGES, JSON.stringify(percentages));
        localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
        localStorage.setItem(STORAGE_KEYS.LAST_STREAK_TIMESTAMP, JSON.stringify(lastStreakTimestamp));
        localStorage.setItem(STORAGE_KEYS.COMPLETED_DAYS, JSON.stringify(completedDays));
        localStorage.setItem(STORAGE_KEYS.LAST_INCREMENT_DATE, JSON.stringify(lastIncrementDate));
      } catch (innerErr) {
        // Still failing after removing images - give up and log error
        console.error('Failed to save to localStorage:', innerErr);
      }
    } else {
      // Some other error occurred (not quota exceeded)
      console.error('Failed to save to localStorage:', err);
    }
  }
};

// === LOAD DATA: Retrieve persisted habit data from localStorage ===
// Call this on app startup to restore user's session
// Returns object with all saved habit data; returns defaults if nothing found
export const loadFromLocalStorage = (userId) => {
  try {
    // Get user-specific storage keys
    const STORAGE_KEYS = getStorageKeys(userId);
    
    // === RETRIEVE RAW DATA FROM STORAGE ===
    // localStorage.getItem() returns JSON string or null if key not found
    const habits = localStorage.getItem(STORAGE_KEYS.HABITS);
    const percentagesData = localStorage.getItem(STORAGE_KEYS.PERCENTAGES);
    const streakData = localStorage.getItem(STORAGE_KEYS.STREAK);
    const timestampData = localStorage.getItem(STORAGE_KEYS.LAST_STREAK_TIMESTAMP);
    const completedDaysData = localStorage.getItem(STORAGE_KEYS.COMPLETED_DAYS);
    const incrementDateData = localStorage.getItem(STORAGE_KEYS.LAST_INCREMENT_DATE);
    
    // Get today's date in YYYY-MM-DD format for comparison
    const today = new Date().toISOString().split('T')[0];

    // === PARSE DATA FROM JSON ===
    // Convert JSON strings back to JavaScript objects
    // If data doesn't exist, use default values
    const parsedCompletedDays = completedDaysData ? JSON.parse(completedDaysData) : 0;
    const parsedLastIncrementDate = incrementDateData ? JSON.parse(incrementDateData) : null;
    
    // === DETERMINE IF TODAY WAS COMPLETED ===
    // completedToday = 1 only if user already completed today
    // If last increment date is today AND completedDays > 0, they completed today
    const completedToday = parsedLastIncrementDate === today ? (parsedCompletedDays > 0 ? 1 : 0) : 0;

    // === RETURN PARSED DATA ===
    return {
      habits: habits ? JSON.parse(habits) : null,                    // Array of habit objects or null
      percentages: percentagesData ? JSON.parse(percentagesData) : {},  // Object mapping habitId to percentage
      streak: streakData ? JSON.parse(streakData) : 0,               // Current streak count (integer)
      lastStreakTimestamp: timestampData ? JSON.parse(timestampData) : null,  // Timestamp of last streak update
      completedDays: completedToday,                                 // Days with 100% completion
      completedToday,                                                // Whether completed today (0 or 1)
      lastIncrementDate: parsedLastIncrementDate,                    // Last date user took action
    };
  } catch (err) {
    // If JSON parsing fails or any other error, log and return defaults
    // This prevents app from crashing if localStorage data is corrupted
    console.error('Failed to load from localStorage:', err);
    
    // Return safe default values
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

// === CLEAR DATA: Remove all habit data for a user ===
// Call this on logout to clean up user's local data
// Useful when switching users on same browser
export const clearHabitStorage = (userId) => {
  try {
    // Get all storage keys for this user
    const STORAGE_KEYS = getStorageKeys(userId);
    
    // === DELETE ALL KEYS FOR THIS USER ===
    // Object.values() gets all key names from STORAGE_KEYS object
    // forEach() removes each key from localStorage
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (err) {
    // If deletion fails, log error but don't crash
    // This shouldn't happen in normal circumstances
    console.error('Failed to clear localStorage:', err);
  }
};
