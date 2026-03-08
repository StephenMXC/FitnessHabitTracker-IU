import { useState, useCallback } from 'react';
import { habitsAPI } from '../services/api';

export const useHabitActions = () => {
  const [habitsList, setHabitsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await habitsAPI.getHabits();
      setHabitsList(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch habits:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createHabit = useCallback(
    async (name, category, description, selectedImage, commitmentTime) => {
      if (!name.trim()) {
        throw new Error('Habit name is required');
      }

      if (!selectedImage) {
        throw new Error('Please select an image');
      }

      try {
        const response = await habitsAPI.createHabit(
          name,
          category,
          description,
          selectedImage
        );

        const habitWithImage = {
          ...response,
          image: selectedImage,
          commitmentTime,
        };

        setHabitsList((prev) => [...prev, habitWithImage]);
        return habitWithImage;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const updateHabit = useCallback(async (habitId, updatedData) => {
    try {
      setEditLoading(true);
      await habitsAPI.updateHabit(
        habitId,
        updatedData.name,
        updatedData.category,
        updatedData.description,
        updatedData.image
      );

      setHabitsList((prev) =>
        prev.map((habit) =>
          habit.id === habitId
            ? {
                ...habit,
                name: updatedData.name,
                category: updatedData.category,
                description: updatedData.description,
                image: updatedData.image,
                commitmentTime: updatedData.commitmentTime,
              }
            : habit
        )
      );

      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setEditLoading(false);
    }
  }, []);

  const deleteHabit = useCallback(async (habitId) => {
    try {
      setEditLoading(true);
      await habitsAPI.deleteHabit(habitId);
      setHabitsList((prev) => prev.filter((habit) => habit.id !== habitId));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setEditLoading(false);
    }
  }, []);

  return {
    habitsList,
    setHabitsList,
    loading,
    error,
    setError,
    editLoading,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
  };
};
