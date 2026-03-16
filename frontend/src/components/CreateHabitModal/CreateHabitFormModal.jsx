import React from 'react';
import { AVAILABLE_IMAGES, COMMITMENT_TIMES } from '../../pages/Habits/habitsConstant';
import '../CreateHabitModal/createHabitModal.css';

export default function CreateHabitFormModal({
  isOpen,
  onClose,
  newHabitForm,
  setNewHabitForm,
  onSubmit,
}) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 500KB to avoid server issues)
      if (file.size > 500000) {
        alert('Image size must be less than 500KB. Please use a smaller image.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setNewHabitForm((prev) => ({
          ...prev,
          selectedImage: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-modal-overlay">
      <div className="create-modal-content">
        <button
          className="create-modal-close"
          onClick={() => {
            onClose();
            setNewHabitForm({
              name: '',
              category: 'general',
              description: '',
              selectedImage: null,
              commitmentTime: '30',
            });
          }}
        >
          ×
        </button>
        <h2 className="create-modal-title">Create New Habit</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Habit Name *</label>
            <input
              type="text"
              className="form-input"
              value={newHabitForm.name}
              onChange={(e) =>
                setNewHabitForm({ ...newHabitForm, name: e.target.value })
              }
              placeholder="e.g., Morning Run, Reading"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Photo *</label>
            <div className="photo-grid">
              {AVAILABLE_IMAGES.map((img) => (
                <div
                  key={img.id}
                  className={`photo-option ${
                    newHabitForm.selectedImage === img.image ? 'selected' : ''
                  }`}
                  onClick={() =>
                    setNewHabitForm({
                      ...newHabitForm,
                      selectedImage: img.image,
                    })
                  }
                >
                  <img src={img.image} alt={img.name} />
                  <span className="photo-label">{img.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Or upload your own image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="form-input image-upload-button"
            />
            {newHabitForm.selectedImage && !AVAILABLE_IMAGES.some(img => img.image === newHabitForm.selectedImage) && (
              <p className="image-preview-text">
                ✓ Custom image selected (max 500KB)
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Commitment Time</label>
            <select
              className="form-input"
              value={newHabitForm.commitmentTime}
              onChange={(e) =>
                setNewHabitForm({
                  ...newHabitForm,
                  commitmentTime: COMMITMENT_TIMES.find(
                    (ct) => ct.value === e.target.value
                  )?.label || '30 mins/day',
                })
              }
              style={{ cursor: 'pointer' }}
            >
              {COMMITMENT_TIMES.map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={newHabitForm.category}
              onChange={(e) =>
                setNewHabitForm({ ...newHabitForm, category: e.target.value })
              }
              style={{ cursor: 'pointer' }}
            >
              <option value="general">General</option>
              <option value="fitness">Fitness</option>
              <option value="health">Health</option>
              <option value="learning">Learning</option>
              <option value="productivity">Productivity</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input description-textarea"
              value={newHabitForm.description}
              onChange={(e) =>
                setNewHabitForm({
                  ...newHabitForm,
                  description: e.target.value,
                })
              }
              placeholder="Optional: Describe your habit"
            />
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              onClick={() => {
                onClose();
                setNewHabitForm({
                  name: '',
                  category: 'general',
                  description: '',
                  selectedImage: null,
                  commitmentTime: '30',
                });
              }}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-button"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
