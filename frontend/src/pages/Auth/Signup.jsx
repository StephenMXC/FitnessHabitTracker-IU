import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { IoFitness } from 'react-icons/io5';
import '../Fitness/fitness.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Validation
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const result = await signup(formData.username, formData.email, formData.password);

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
            <h1>Start Your Journey</h1>
            <p>Create your account to unlock analytics and goals.</p>
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
              type="email"
              name="email"
              placeholder="Email Address"
              className="input-field"
              value={formData.email}
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
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="input-field"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />

            {(localError || error) && (
              <div style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
                {localError || error}
              </div>
            )}

            <button
              type="submit"
              className="create-account-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        </div>

        <div className="left-div-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Log In
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

export default Signup;
