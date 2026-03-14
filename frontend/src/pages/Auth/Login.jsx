import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { IoFitness } from 'react-icons/io5';
import '../Fitness/fitness.css'; // Reusing fitness styles

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }

    const result = await login(formData.username, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div className="fitness-page">
      <div className="left-div">
        <div className="left-div-header">
          <div className="fitnessApp-title">
            <IoFitness size={40} color="#4CAF50" />
            <p>FitnessApp</p>
          </div>
          <div className="Start-your-journey">
            <h1>Welcome Back</h1>
            <p>Log in to continue tracking your fitness goals.</p>
          </div>
        </div>

        <div className="left-div-body">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input-field"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />

            {(localError || error) && (
              <div style={{ color: '#2313d2', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {localError || error}
              </div>
            )}

            <button
              type="submit"
              className="create-account-button"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.6 : 1 }}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>

        <div className="left-div-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="login-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <div className="right-div">
        <h1>Welcome to FitnessApp</h1>
        <p>Your ultimate companion for tracking workouts, monitoring progress, and achieving your fitness goals.</p>
      </div>
    </div>
  );
};

export default Login;
