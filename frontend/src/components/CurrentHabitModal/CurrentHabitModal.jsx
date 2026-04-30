// ============================================
// CURRENT HABIT MODAL - VIEW/EDIT CONTAINER
// ============================================
// PURPOSE: Modal to view and interact with current habit details.
// RECEIVES: { isOpen, onClose, children, habit }
// ============================================

import React, { useState, useEffect } from 'react';
import { CurrentHabitForm } from './CurrentHabitForm';
import './currentHabitModal.css';

// === MODAL FOR VIEWING/EDITING CURRENT HABIT ===
// Displays a modal overlay with habit details and allows editing
// Props:
//   - habit: habit object to display/edit
//   - currentPercentage: current completion percentage
//   - isOpen: whether modal is visible
//   - onClose: callback when user closes modal
//   - onSave: callback when user saves changes
//   - onDelete: callback when user deletes habit
export const CurrentHabitModal = ({
    habit,
    currentPercentage,
    isOpen,
    onClose,
    onSave,
    onDelete
}) => {
    // === LOCAL STATE FOR FORM ===
    const [formData, setFormData] = useState({
        title: habit?.title || '',
        image: habit?.image || '',
        completionRate: Number(habit?.completionRate) || 0,
        commitmentLevel: habit?.engagementTime || '',
    });

    // Track if completion rate was manually changed (vs loaded from habit)
    const [completionRateChanged, setCompletionRateChanged] = useState(false);

    // Handler for commitment level changes (currently defined but not used)
    const handleCommitmentLevel = (level) => {
        setCommitmentLevel(level);
    }

    // === SYNC FORMDATA WITH HABIT PROP ===
    // When habit prop changes, reset form data to habit's values
    // This ensures form shows correct data when different habit is opened
    useEffect(() => {
        if (habit) {
            setFormData({
                title: habit.title || '',
                image: habit.image || '',
                completionRate: habit.completionRate || 0,
                commitmentLevel: habit.engagementTime || '',
            });
            // Mark completion rate as unchanged (user hasn't modified it yet)
            setCompletionRateChanged(false);
        }
    }, [habit]);

    // === RETURN NULL IF NOT OPEN ===
    // Don't render anything if modal is closed (performance optimization)
    if (!isOpen) return null;

    // === INPUT CHANGE HANDLER ===
    // Updates form state when user types in inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Spread operator keeps all other properties, only updates the changed one
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // === COMPLETION RATE CHANGE HANDLER ===
    // Called when user modifies the completion rate slider/input
    const handleCompletionRateChange = (e) => {
        setFormData(prev => ({
            ...prev,
            completionRate: Number(e.target.value),  // Convert to number from form input
        }));
        setCompletionRateChanged(true);  // Mark that user changed this value
    };

    // === COMMITMENT LEVEL CHANGE HANDLER ===
    // Called when user selects different commitment level
    const handleCommitmentLevelChange = (value) => {
        setFormData(prev => ({
            ...prev,
            commitmentLevel: value,
        }));
    };

    // === SAVE HANDLER ===
    // Called when user clicks "Save Changes" button
    const handleSave = () => {
        onSave(formData);  // Pass form data to parent component
        onClose();         // Close modal after save
    };

    // === CANCEL HANDLER ===
    // Called when user clicks "Cancel" button or close (X) button
    // Reverts form to original habit data
    const handleCancel = () => {
        // Reset form data to original habit state (undo any changes)
        setFormData({
            title: habit?.title || '',
            image: habit?.image || '',
            completionRate: habit?.completionRate || 0,
            commitmentLevel: habit?.engagementTime || '',
        });
        setCompletionRateChanged(false);  // Mark as unchanged
        onClose();                         // Close modal
    };

    // === KEEP COMPLETION RATE HANDLER ===
    // Called when user clicks button to use current percentage instead of form value
    const handleKeepCompletionRate = () => {
        setFormData(prev => ({
            ...prev,
            completionRate: Number(currentPercentage),  // Use current percentage
        }));
        setCompletionRateChanged(false);  // Mark as not manually changed
    };

    // === RENDER MODAL ===
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Close button (X) in top right */}
                <button className="modal-close" onClick={handleCancel}>&times;</button>
                
                <div className="modal-body">
                    <h2 className="modal-title">Edit Habit</h2>
                    
                    {/* Form component for editing habit details */}
                    <CurrentHabitForm
                        formData={formData}
                        onInputChange={handleInputChange}
                        onCompletionRateChange={handleCompletionRateChange}
                        completionRateChanged={completionRateChanged}
                        onKeepCompletionRate={handleKeepCompletionRate}
                        onCommitmentLevelChange={handleCommitmentLevelChange}
                    />

                    {/* Action buttons */}
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