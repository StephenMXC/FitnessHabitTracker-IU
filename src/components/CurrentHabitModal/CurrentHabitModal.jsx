import React, { useState, useEffect } from 'react';
import { CurrentHabitForm } from './CurrentHabitForm';
import './currentHabitModal.css';

export const CurrentHabitModal = ({
    habit,
    currentPercentage,
    isOpen,
    onClose,
    onSave,
    onDelete
}) => {

    const [formData, setFormData] = useState({
        title: habit?.title || '',
        image: habit?.image || '',
        completionRate: Number(habit?.completionRate) || 0,
    });

    const [completionRateChanged, setCompletionRateChanged] = useState(false);

    const handleCommitmentLevel = (level) => {
        setCommitmentLevel(level);
    }

    useEffect(() => {
        if (habit) {
            setFormData({
                title: habit.title || '',
                image: habit.image || '',
                completionRate: habit.completionRate || 0,
            });
            setCompletionRateChanged(false);
        }
    }, [habit]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCompletionRateChange = (e) => {
        setFormData(prev => ({
            ...prev,
            completionRate: Number(e.target.value),
        }));
        setCompletionRateChanged(true);
    };


    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    const handleCancel = () => {
        setFormData({
            title: habit?.title || '',
            image: habit?.image || '',
            completionRate: habit?.completionRate || 0,
        });
        setCompletionRateChanged(false);
        onClose();
    };

    const handleKeepCompletionRate = () => {
        setFormData(prev => ({
            ...prev,
            completionRate: Number(currentPercentage),
        }));
        setCompletionRateChanged(false);
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={handleCancel}>&times;</button>
                
                <div className="modal-body">
                    <h2 className="modal-title">Edit Habit</h2>
                    
                    <CurrentHabitForm
                        formData={formData}
                        onInputChange={handleInputChange}
                        onCompletionRateChange={handleCompletionRateChange}
                        completionRateChanged={completionRateChanged}
                        onKeepCompletionRate={handleKeepCompletionRate}
                        commitmentLevel={handleCommitmentLevel}
                    />

                    <div className="modal-actions">
                        <button onClick={handleCancel} className="btn-secondary">Cancel</button>
                        <button onClick={() => onDelete(habit?.id)} className="btn-danger">Delete</button>
                        <button onClick={handleSave} className="btn-primary">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};