import React, { useState, useEffect, useRef } from 'react';
import './habits.css';
import { FaPlus } from "react-icons/fa";
import 'react-circular-progressbar/dist/styles.css';
import DailyGoalContainer from '../../components/DailyGoalContainer/DailyGoalContainer.jsx';
import StatCard from '../../components/StatCard/StatCard.jsx';
import EditHabitModal from '../../components/EditHabitModal/EditHabitModal.jsx';
import CreateHabitFormModal from '../../components/CreateHabitModal/CreateHabitFormModal.jsx';
import { STATS_CARD_DATA, formatCommitmentTime } from './habitsConstant.jsx';
import { useHabitActions } from '../../hooks/useHabitActions.js';
import { saveToLocalStorage, loadFromLocalStorage } from '../../utils/habitStorage.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import '../../components/CreateHabitModal/createHabitModal.css';

const Habits = () => {
  const { user } = useAuth();
  const [percentages, setPercentages] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditingHabit, setCurrentEditingHabit] = useState(null);
  const [streak, setStreak] = useState(0);
  const [lastStreakTimestamp, setLastStreakTimestamp] = useState(null);
  const [completedToday, setCompletedToday] = useState(0);
  const [lastIncrementDate, setLastIncrementDate] = useState(null);
  const prevCompletionRate = useRef(null);

  const [newHabitForm, setNewHabitForm] = useState({
    name: '',
    category: 'general',
    description: '',
    selectedImage: null,
    commitmentTime: '30',
  });

  const { habitsList, setHabitsList, loading, error, setError, editLoading, fetchHabits, createHabit, updateHabit, deleteHabit } = useHabitActions();

  // Clear state when user changes (runs first)
  useEffect(() => {
    if (!user?.userId) {
      // If no user, clear everything
      setPercentages({});
      setStreak(0);
      setLastStreakTimestamp(null);
      setCompletedToday(0);
      setLastIncrementDate(null);
    }
  }, [user?.userId]);

  // Initialize component with fetch and localStorage restore
  useEffect(() => {
    if (!user?.userId) return; // Don't load if user not authenticated

    const loadAndFetchHabits = async () => {
      // Load from localStorage first (as primary source)
      const localData = loadFromLocalStorage(user.userId);
      
      console.log(`Loading data for user ${user.userId}:`, localData);
      
      // Restore local state immediately from localStorage
      if (localData.habits && localData.habits.length > 0) {
        setHabitsList(localData.habits);
      } else {
        setHabitsList([]);
      }
      
      // Always restore percentages from localStorage for this user
      setPercentages(localData.percentages || {});
      setStreak(localData.streak || 0);
      setLastStreakTimestamp(localData.lastStreakTimestamp || null);
      setCompletedToday((localData.completedToday ?? localData.completedDays) || 0);
      setLastIncrementDate(localData.lastIncrementDate || null);

      // Fetch from backend to get latest data (but keep localStorage images)
      const backendHabits = await fetchHabits();
      if (backendHabits && backendHabits.length > 0) {
        // Merge: backend data as primary, but restore images from localStorage
        const mergedHabits = backendHabits.map(backendHabit => {
          const localHabit = localData.habits && localData.habits.find(h => h.id === backendHabit.id);
          return {
            ...backendHabit,
            // Keep backend image if it exists, otherwise use localStorage image
            image: backendHabit.image || (localHabit && localHabit.image),
            // Normalize commitmentTime to a readable label
            commitmentTime: formatCommitmentTime(
              backendHabit.commitmentTime || (localHabit && localHabit.commitmentTime)
            ),
          };
        });
        setHabitsList(mergedHabits);
        
        // Initialize percentages for any new habits
        setPercentages(prev => {
          const updated = { ...localData.percentages }; // Start with loaded data
          mergedHabits.forEach(habit => {
            if (!(habit.id in updated)) {
              updated[habit.id] = 0; // New habit gets 0
            }
          });
          return updated;
        });
      }
    };

    loadAndFetchHabits();
  }, [user?.userId]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (habitsList.length > 0 && user?.userId) {
      saveToLocalStorage(habitsList, percentages, streak, lastStreakTimestamp, completedToday, lastIncrementDate, user.userId);
    }
  }, [habitsList, percentages, streak, lastStreakTimestamp, completedToday, lastIncrementDate, user?.userId]);

  // Check for 100% completion rate and mark completedToday once per day
  useEffect(() => {
    if (habitsList.length === 0 || !user?.userId) {
      prevCompletionRate.current = null;
      return;
    }

    const rate = completionRates();
    const today = new Date().toISOString().split('T')[0];

    if (rate === 100) {
      if (lastIncrementDate !== today && prevCompletionRate.current !== 100) {
        setCompletedToday(1);
        setLastIncrementDate(today);
      } else if (lastIncrementDate === today && completedToday !== 1) {
        setCompletedToday(1);
      }
    } else if (lastIncrementDate !== today && completedToday !== 0) {
      setCompletedToday(0);
    }

    prevCompletionRate.current = rate;
  }, [percentages, habitsList, lastIncrementDate, completedToday, user?.userId]);

  const handleCreateHabit = async (e) => {
    e.preventDefault();

    try {
      const formattedCommitmentTime = formatCommitmentTime(newHabitForm.commitmentTime);
      const newHabit = await createHabit(
        newHabitForm.name,
        newHabitForm.category,
        newHabitForm.description,
        newHabitForm.selectedImage,
        formattedCommitmentTime
      );

      if (newHabit) {
        const updatedList = [...habitsList, newHabit];
        saveToLocalStorage(updatedList, { ...percentages, [newHabit.id]: 0 }, streak, lastStreakTimestamp, completedToday, lastIncrementDate, user.userId);
      }

      setPercentages((prev) => ({
        ...prev,
        [newHabit?.id || habitsList.length]: 0,
      }));

      setNewHabitForm({
        name: '',
        category: 'general',
        description: '',
        selectedImage: null,
        commitmentTime: '30',
      });
      setShowCreateModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditHabit = (habit) => {
    setCurrentEditingHabit(habit);
    setShowEditModal(true);
  };

  const handleUpdateHabit = async (updatedData) => {
    if (!currentEditingHabit) return;

    try {
      const formattedCommitmentTime = formatCommitmentTime(updatedData.commitmentTime);
      await updateHabit(currentEditingHabit.id, {
        ...updatedData,
        commitmentTime: formattedCommitmentTime,
      });
      
      const updatedList = habitsList.map(h => 
        h.id === currentEditingHabit.id 
          ? { ...h, ...updatedData, commitmentTime: formattedCommitmentTime }
          : h
      );
      setHabitsList(updatedList);
      saveToLocalStorage(updatedList, percentages, streak, lastStreakTimestamp, completedToday, lastIncrementDate, user.userId);
      
      setShowEditModal(false);
      setCurrentEditingHabit(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteHabit = async () => {
    if (!currentEditingHabit) return;

    try {
      await deleteHabit(currentEditingHabit.id);
      
      const updatedList = habitsList.filter(h => h.id !== currentEditingHabit.id);
      const updatedPercentages = { ...percentages };
      delete updatedPercentages[currentEditingHabit.id];
      setPercentages(updatedPercentages);
      saveToLocalStorage(updatedList, updatedPercentages, streak, lastStreakTimestamp, completedToday, lastIncrementDate, user.userId);
      
      setShowEditModal(false);
      setCurrentEditingHabit(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleComplete = (id) => {
    const now = Date.now();

    // percentage logic
    setPercentages((p) => ({
      ...p,
      [id]: Math.min((p[id] ?? 0) + 10, 100),
    }));

    // streak logic
    setStreak((prevStreak) => {
      if (!lastStreakTimestamp) {
        setLastStreakTimestamp(now);
        return 1;
      }

      const hoursSinceLast = (now - lastStreakTimestamp) / (1000 * 60 * 60);

      if (hoursSinceLast <= 24) {
        return prevStreak;
      }

      if (hoursSinceLast <= 48) {
        setLastStreakTimestamp(now);
        return prevStreak + 1;
      }

      setLastStreakTimestamp(now);
      return 1;
    });
  };

  const completionRates = () => {
    if (habitsList.length === 0) return 0;
    const habits = habitsList.map((habit) => percentages[habit.id] || 0);
    const completionRate = habits.reduce((sum, value) => sum + value, 0) / habits.length;
    return Math.round(completionRate);
  };

  if (loading && habitsList.length === 0) {
    return (
      <div className="main-page-containter">
        <h1>Loading habits...</h1>
      </div>
    );
  }

  const HabitCards = habitsList.length;

  return (
    <div className="main-page-containter">
      {/* Stats Cards */}
      <section className="currentstreak-totalhabits-completionrate-cards">
        {STATS_CARD_DATA.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={
              stat.id === "habits"
                ? String(HabitCards)
                : stat.id === "rate"
                ? completionRates() + "%"
                : stat.id === "streak"
                ? streak + " Days"
                : stat.value
            }
            icon={stat.icon}
          />
        ))}
      </section>

      {/* Error message */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <h1 className="page-title">Fitness/Habits</h1>

      {/* Habit Cards */}
      <section className="habit-cards">
        {habitsList.map((habit) => (
          <DailyGoalContainer
            key={habit.id}
            dailyGoal="Pending"
            isActive={false}
            title={habit.name}
            engagementTime={formatCommitmentTime(habit.commitmentTime)}
            buttonTitle="Mark Complete"
            image={habit.image}
            percentage={percentages[habit.id] || 0}
            buttonAction={() => handleComplete(habit.id)}
            modalAction={() => handleEditHabit(habit)}
          />
        ))}

        {/* Create New Habit Button Card */}
        <div className="new-goals-card">
          <div className="new-habit-button-container">
            <button
              className="new-habit-button"
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus /> New Habit
            </button>
          </div>
        </div>
      </section>

      {/* Create Habit Modal */}
      <CreateHabitFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        newHabitForm={newHabitForm}
        setNewHabitForm={setNewHabitForm}
        onSubmit={handleCreateHabit}
      />

      {/* Edit Habit Modal */}
      <EditHabitModal
        habit={currentEditingHabit}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setCurrentEditingHabit(null);
        }}
        onSave={handleUpdateHabit}
        onDelete={handleDeleteHabit}
        isLoading={editLoading}
      />
    </div>
  );
};

export default Habits;
