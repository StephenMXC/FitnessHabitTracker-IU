import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedDays, setCompletedDays] = useState(0);

  useEffect(() => {
    // Reset completed days when user changes
    if (!user?.userId) {
      setCompletedDays(0);
      return;
    }
    
    fetchStats();
    // Load completed days from localStorage (user-specific)
    const completedDaysKey = `fitnessTracker_completedDays_${user.userId}`;
    const storedCompletedDays = localStorage.getItem(completedDaysKey);
    console.log(`Loading completedDays for user ${user.userId}:`, storedCompletedDays);
    if (storedCompletedDays) {
      setCompletedDays(JSON.parse(storedCompletedDays));
    } else {
      setCompletedDays(0);
    }
  }, [user?.userId]);

  const fetchStats = async () => {
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
      </div>
    </div>
  );
};

export default Dashboard;