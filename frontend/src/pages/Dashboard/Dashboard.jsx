import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

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
        <div className="dashboard-content" style={{ color: '#d32f2f' }}>
          <p>Error: {error}</p>
          <button onClick={fetchStats} style={{ marginTop: '1rem' }}>
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
        <p>Welcome back, {user?.userId}! 👋</p>
        <div style={{ marginTop: '2rem' }}>
          <h2>Your Stats</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ color: '#666' }}>Total Habits</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>
                {stats?.totalHabits || 0}
              </p>
            </div>
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ color: '#666' }}>Completed Today</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>
                {stats?.completedToday || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;