import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import { dashboardAPI, habitsAPI } from '../../services/api';
import { loadFromLocalStorage } from '../../utils/habitStorage.js';
import { useAuth } from '../../contexts/AuthContext';
import { formatCommitmentTime } from '../Habits/habitsConstant.jsx';
import fritImage from '../../assets/frit.png';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streak, setStreak] = useState(0);
  const [habitProgress, setHabitProgress] = useState([]);
  const [percentages, setPercentages] = useState({});
  const isInitialLoadRef = useRef(true);
  const localHabitMapRef = useRef({});

  const fetchStats = useCallback(async () => {
    try {
      // Only show loading on initial load, not on refreshes
      if (isInitialLoadRef.current) {
        setLoading(true);
      }
      const data = await dashboardAPI.getStats();
      console.log('Dashboard stats received:', data);
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      if (isInitialLoadRef.current) {
        setLoading(false);
        isInitialLoadRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    if (!user?.userId) {
      setStreak(0);
      setHabitProgress([]);
      setPercentages({});
      return;
    }

    const loadLocalProgress = async () => {
      const localData = loadFromLocalStorage(user.userId);
      setStreak(localData.streak || 0);
      setPercentages(localData.percentages || {});

      const localHabits = localData.habits || [];
      const localPercentages = localData.percentages || {};
      const localHabitMap = {};
      localHabits.forEach((habit) => {
        localHabitMap[habit.id] = habit;
      });
      localHabitMapRef.current = localHabitMap;

      if (localHabits.length > 0) {
        setHabitProgress(
          localHabits.map((habit) => ({
            id: habit.id,
            name: habit.name,
            category: habit.category,
            percentage: Math.max(0, Math.min(100, localPercentages[habit.id] ?? 0)),
            commitmentTime: formatCommitmentTime(habit.commitmentTime || '30'),
          }))
        );
      } else {
        try {
          const backendHabits = await habitsAPI.getHabits();
          setHabitProgress(
            backendHabits.map((habit) => ({
              id: habit.id,
              name: habit.name,
              category: habit.category,
              percentage: 0,
              commitmentTime: formatCommitmentTime(localHabitMap[habit.id]?.commitmentTime || '30'),
            }))
          );
        } catch (err) {
          setHabitProgress([]);
        }
      }
    };

    const loadDashboardData = async () => {
      await loadLocalProgress();
      await fetchStats();
    };

    loadDashboardData();

    // Refetch stats every 5 seconds to catch updates from Habits page
    const statsRefreshInterval = setInterval(() => {
      fetchStats();
    }, 5000);

    const handleStorageUpdate = (event) => {
      if (!event.key || !event.key.includes(user.userId)) return;
      loadLocalProgress();
      fetchStats(); // Also refetch stats when localStorage changes
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      clearInterval(statsRefreshInterval);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [user?.userId, fetchStats]);

  const getDayLabel = (index) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[index];
  };

  const getDayLetter = (index) => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return days[index];
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>
        <div className="dashboard-content">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>
        <div className="dashboard-content error-content">
          <p>Error: {error}</p>
          <button onClick={fetchStats} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <img src={fritImage} alt="Frit" className="dashboard-frit-image" />
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="welcome-text">Welcome, {user?.username}</p>
      </div>
      <div className="dashboard-content">
        {/* Stats Cards Row */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-title">CURRENT STREAK</h3>
              <p className="stat-value">{streak} <span className="stat-unit">days</span></p>
              <p className="stat-subtitle">personal best: {streak}</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">TOTAL HABITS</h3>
              <p className="stat-value">{stats?.totalHabits || 0}</p>
              <p className="stat-subtitle">
                {stats?.completedToday || 0} active today
              </p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">COMPLETION RATE</h3>
              <p className="stat-value">{stats?.completionRate || 0}%</p>
              <p className="stat-subtitle">this week</p>
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="weekly-section">
          <h2>THIS WEEK</h2>
          <div className="weekly-days">
            {stats && (stats.weeklyCompletion || [false, false, false, false, false, false, false]).map((isCompleted, index) => (
              <div key={index} className={`day-indicator ${isCompleted ? 'completed' : ''}`}>
                <span className="day-letter">{getDayLetter(index)}</span>
                <span className="day-label">{getDayLabel(index)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid: Checklist + Completion Graph */}
        <div className="dashboard-grid">
          {/* Today's Checklist */}
          <div className="checklist-section">
            <h2>TODAY'S CHECKLIST</h2>
            {habitProgress.length > 0 ? (
              <div className="checklist-items">
                {habitProgress.map((habit) => {
                  const isCompleted = percentages[habit.id] === 100;
                  return (
                    <div
                      key={habit.id}
                      className="checklist-item clickable"
                      onClick={() => navigate('/habits')}
                    >
                      <div className="checkbox-wrapper">
                        {isCompleted ? (
                          <div className="checkbox checked">
                            <span>✓</span>
                          </div>
                        ) : (
                          <div className="checkbox unchecked"></div>
                        )}
                      </div>
                      <span className="checklist-label">{habit.name}</span>
                      <span className="checklist-duration">
                        {habit.commitmentTime || '30 mins/day'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="empty-state">No habits yet</p>
            )}
          </div>

          {/* Habit Completion Graph */}
          <div className="completion-section">
            <h2>HABIT COMPLETION</h2>
            {habitProgress.length > 0 ? (
              <div className="habits-completion-list">
                {habitProgress.map((habit) => (
                  <div key={habit.id} className="habit-completion-item">
                    <div className="habit-info">
                      <span className="habit-name">{habit.name}</span>
                      <span className={`habit-category ${habit.category}`}>{habit.category}</span>
                    </div>
                    <div className="habit-bar-container">
                      <div className="habit-bar-track">
                        <div
                          className="habit-bar-fill"
                          style={{ width: `${habit.percentage}%` }}
                        />
                      </div>
                      <span className="habit-percentage">{habit.percentage}%</span>
                    </div>
                    {habit.percentage === 100 && (
                      <span className="streak-badge">
                        {streak > 0 ? `${streak}-day streak` : 'On track'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No habits yet. Create a habit on the Fitness/Habits page.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;