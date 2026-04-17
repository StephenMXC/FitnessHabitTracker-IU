import React, { useState, useEffect, useCallback } from 'react';
import './dashboard.css';
import { dashboardAPI, habitsAPI } from '../../services/api';
import { loadFromLocalStorage } from '../../utils/habitStorage.js';
import { useAuth } from '../../contexts/AuthContext';
import fritImage from '../../assets/frit.png';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedDays, setCompletedDays] = useState(0);
  const [habitProgress, setHabitProgress] = useState([]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.userId) {
      setCompletedDays(0);
      setHabitProgress([]);
      return;
    }

    const loadLocalProgress = async () => {
      const localData = loadFromLocalStorage(user.userId);
      setCompletedDays((localData.completedToday ?? localData.completedDays) || 0);

      const localHabits = localData.habits || [];
      const localPercentages = localData.percentages || {};

      if (localHabits.length > 0) {
        setHabitProgress(
          localHabits.map((habit) => ({
            id: habit.id,
            name: habit.name,
            percentage: Math.max(0, Math.min(100, localPercentages[habit.id] ?? 0)),
          }))
        );
      } else {
        try {
          const backendHabits = await habitsAPI.getHabits();
          setHabitProgress(
            backendHabits.map((habit) => ({
              id: habit.id,
              name: habit.name,
              percentage: 0,
            }))
          );
        } catch (err) {
          setHabitProgress([]);
        }
      }
    };

    loadLocalProgress();
    fetchStats();

    const handleStorageUpdate = (event) => {
      if (!event.key || !event.key.includes(user.userId)) return;
      loadLocalProgress();
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, [user?.userId, fetchStats]);

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
      </div>
      <div className="dashboard-content">
        <p>Welcome, {user?.username}! 👋</p>
        <div className="stats-section">
          <h2>Your Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-title">Total Habits</h3>
              <p className="stat-value">
                {stats?.totalHabits || 0}
              </p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Completed Today</h3>
              <p className="stat-value">
                {completedDays}
              </p>
            </div>
          </div>
        </div>
        <div className="habits-graph-section">
          <h2>Habits Completion</h2>
          {habitProgress.length > 0 ? (
            <div className="habits-graph">
              {habitProgress.map((habit) => (
                <div className="habit-bar-row" key={habit.id}>
                  <span className="habit-bar-label">{habit.name}</span>
                  <div className="habit-bar-track">
                    <div
                      className="habit-bar-fill"
                      style={{ width: `${habit.percentage}%` }}
                    />
                  </div>
                  <span className="habit-bar-value">{habit.percentage}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No habits yet. Create a habit on the Fitness/Habits page to see this graph.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;