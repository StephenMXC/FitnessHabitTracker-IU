import React, { useState } from 'react';
import './currentHabitForm.css';

export const CurrentHabitForm = ({ formData, onInputChange, onCompletionRateChange, completionRateChanged, onKeepCompletionRate }) => {

    const COMMITMENT_TIMES = [
        { value: '15', label: '15 mins/day' },
        { value: '30', label: '30 mins/day' },
        { value: '60', label: '1 hour/day' },
        { value: '120', label: '2 hours/day' },
        { value: '180', label: '3 hours/day' },
    ];

    const [selectedCommitmentLevel, setSelectedCommitmentLevel] = useState('');
    
    return (
        <form className="habit-form">
            <div className="form-section">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={onInputChange}
                    placeholder="Habit title"
                    className="form-input"
                />
            </div>

            <div className='form-group'>
                <label className='form-label'>Daily Commitment</label>
                <select
                    className='form-select'
                    value={selectedCommitmentLevel}
                    onChange={(e) => setSelectedCommitmentTime(e.target.value)}
                >
                    <option value=''>Select commitment time</option>
                    {COMMITMENT_TIMES.map(time => (
                        <option key={time.value} value={time.label}>
                            {time.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-section">
                <label htmlFor="image" className="form-label">Image URL</label>
                <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={onInputChange}
                    placeholder="Image URL"
                    className="form-input"
                />
                {formData.image && (
                    <div className="image-preview-container">
                        <img src={formData.image} alt="preview" className="image-preview" />
                    </div>
                )}
            </div>

            <div className="footer-form-section">
                <div className="form-section">
                    <label htmlFor="completionRate" className="form-label">
                        Completion Rate: <span className="completion-rate-value">{formData.completionRate}%</span>
                    </label>
                    <input
                        type="range"
                        id="completionRate"
                        name="completionRate"
                        min="0"
                        max="100"
                        value={formData.completionRate}
                        onChange={onCompletionRateChange}
                        className="form-range"
                    />
                    {completionRateChanged && (
                        <div className="completion-actions">
                            <button
                                type="button"
                                onClick={onKeepCompletionRate}
                                className="btn-secondary"
                            >
                                Keep Current
                            </button>
                            <span className="info-text">New value: {formData.completionRate}%</span>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
};