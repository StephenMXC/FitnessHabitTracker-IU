import React from 'react';
import EditHabitForm from './EditHabitForm';
import '../CreateHabitModal/createHabitModal.css';

export default function EditHabitModal({
  habit,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isLoading,
}) {
  if (!isOpen) return null;

  return (
    <div className="create-modal-overlay" onClick={onClose}>
      <div className="create-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="create-modal-close"
          onClick={onClose}
          disabled={isLoading}
        >
          ✕
        </button>
        <EditHabitForm
          habit={habit}
          onSave={onSave}
          onCancel={onClose}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
