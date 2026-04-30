// ============================================
// USE HABIT ACTIONS CUSTOM HOOK
// ============================================
// PURPOSE: Manage all habit-related API calls and state management.
// PROVIDES:
// - habitsList: array of all user's habits
// - fetchHabits: get all habits from backend
// - createHabit: add new habit
// - updateHabit: modify existing habit
// - deleteHabit: remove habit
// - loading/error states
// USAGE: const { habitsList, fetchHabits, ... } = useHabitActions();
// ============================================

import { useState, useCallback } from 'react';
import { habitsAPI } from '../services/api';

// === CUSTOM HOOK: useHabitActions ===
// Manages all habit-related API calls and state in one place
// This hook encapsulates logic so components stay clean and focused
// Usage: const { habitsList, fetchHabits, createHabit, ... } = useHabitActions();
export const useHabitActions = () => {
  // === STATE VARIABLES ===
  const [habitsList, setHabitsList] = useState([]);    // Array of all user's habits
  const [loading, setLoading] = useState(true);        // Loading state for initial fetch
  const [error, setError] = useState(null);            // Error messages from failed operations
  const [editLoading, setEditLoading] = useState(false); // Loading state for edit/delete operations

  // === FETCH HABITS ===
  // Get all habits from backend for current user
  // useCallback prevents unnecessary re-renders (memoizes function)
  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await habitsAPI.getHabits();  // Call backend API
      setHabitsList(data);                       // Store habits in state
      setError(null);                            // Clear any previous errors
      return data;                               // Return data for caller
    } catch (err) {
      setError(err.message);                     // Store error message
      console.error('Failed to fetch habits:', err);
      return null;                               // Return null on failure
    } finally {
      setLoading(false);                         // Always stop loading
    }
  }, []);

  // === CREATE HABIT ===
  // Add new habit to backend and update local state
  const createHabit = useCallback(
    async (name, category, description, selectedImage, commitmentTime) => {
      // === VALIDATION ===
      // Ensure required fields are provided before API call
      if (!name.trim()) {
        throw new Error('Habit name is required');
      }

      if (!selectedImage) {
        throw new Error('Please select an image');
      }

      try {
        // === API CALL ===
        // Send habit data to backend
        const response = await habitsAPI.createHabit(
          name,
          category,
          description,
          selectedImage
        );

        // === UPDATE LOCAL STATE ===
        // Create new habit object with response from backend + local data
        const habitWithImage = {
          ...response,               // Backend response (id, createdAt, etc.)
          image: selectedImage,      // Local image (may not be in backend response)
          commitmentTime,            // Local commitment time data
        };

        // Add new habit to habitsList state
        setHabitsList((prev) => [...prev, habitWithImage]);
        return habitWithImage;  // Return habit to caller
      } catch (err) {
        setError(err.message);
        throw err;  // Re-throw so caller can handle error
      }
    },
    []
  );

  // === UPDATE HABIT ===
  // Modify existing habit and sync with backend
  const updateHabit = useCallback(async (habitId, updatedData) => {
    try {
      setEditLoading(true);  // Show loading state for edit operation
      
      // === API CALL ===
      // Send updated data to backend
      await habitsAPI.updateHabit(
        habitId,
        updatedData.name,
        updatedData.category,
        updatedData.description,
        updatedData.image
      );

      // === UPDATE LOCAL STATE ===
      // Update the specific habit in habitsList
      // map() iterates through array and updates matching habit
      setHabitsList((prev) =>
        prev.map((habit) =>
          habit.id === habitId
            ? {
                ...habit,  // Keep existing properties
                // Override with new properties
                name: updatedData.name,
                category: updatedData.category,
                description: updatedData.description,
                image: updatedData.image,
                commitmentTime: updatedData.commitmentTime,
              }
            : habit  // Other habits unchanged
        )
      );

      setError(null);  // Clear any previous errors
    } catch (err) {
      setError(err.message);
      throw err;  // Re-throw so caller can handle error
    } finally {
      setEditLoading(false);  // Always stop loading
    }
  }, []);

  // === DELETE HABIT ===
  // Remove habit from backend and update local state
  const deleteHabit = useCallback(async (habitId) => {
    try {
      setEditLoading(true);  // Show loading state for delete operation
      
      // === API CALL ===
      // Send delete request to backend
      await habitsAPI.deleteHabit(habitId);
      
      // === UPDATE LOCAL STATE ===
      // Remove deleted habit from habitsList
      // filter() returns new array excluding the deleted habit
      setHabitsList((prev) => prev.filter((habit) => habit.id !== habitId));

      setError(null);  // Clear any previous errors
    } catch (err) {
      setError(err.message);
      throw err;  // Re-throw so caller can handle error
    } finally {
      setEditLoading(false);  // Always stop loading
    }
  }, []);

  // === RETURN STATE AND FUNCTIONS ===
  // Package all state and functions to return to caller
  return {
    habitsList,           // Current array of habits
    setHabitsList,        // Function to manually update habitsList
    loading,              // Loading state for initial fetch
    error,                // Error message from failed operations
    setError,             // Function to manually set error
    editLoading,          // Loading state for edit/delete operations
    fetchHabits,          // Function to fetch habits from backend
    createHabit,          // Function to create new habit
    updateHabit,          // Function to update existing habit
    deleteHabit,          // Function to delete habit
  };
};
