import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import '../CreateHabitModal/createHabitModal.css';
import { AVAILABLE_IMAGES, COMMITMENT_TIMES, formatCommitmentTime, getCommitmentValue } from '../../pages/Habits/habitsConstant';

export default function EditHabitForm({
  habit,
  onSave,
  onCancel,
  onDelete,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    category: habit?.category || 'general',
    description: habit?.description || '',
    commitmentTime: getCommitmentValue(habit?.commitmentTime),
    selectedImage: habit?.image || null,
  });

  const [previewImage, setPreviewImage] = useState(habit?.image || null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (imageData) => {
    setFormData((prev) => ({
      ...prev,
      selectedImage: imageData.image,
    }));
    setPreviewImage(imageData.image);
    setUploadedFileName(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 500KB to avoid server issues)
      if (file.size > 500000) {
        alert('Image size must be less than 500KB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setFormData((prev) => ({
          ...prev,
          selectedImage: base64,
        }));
        setPreviewImage(base64);
        setUploadedFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Habit name is required');
      return;
    }

    onSave({
      name: formData.name,
      category: formData.category,
      description: formData.description,
      image: formData.selectedImage,
      commitmentTime: formatCommitmentTime(formData.commitmentTime),
    });
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      onDelete();
    }
  };

  return (
    <div className="habit-form">
      <h2 className="edit-habit" style={{ marginBottom: '20px', color: '#2d5016' }}>Edit Habit</h2>

      {/* Habit Name */}
      <div
        style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}
      >
        <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          Habit Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g., Morning Run"
          style={{
            padding: '8px',
            border: '1px solid #2d5016',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Category */}
      <div
        style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}
      >
        <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          style={{
            padding: '8px',
            border: '1px solid #2d5016',
            borderRadius: '4px',
          }}
        >
          <option value="health">Health</option>
          <option value="fitness">Fitness</option>
          <option value="mental">Mental</option>
          <option value="learning">Learning</option>
          <option value="general">General</option>
        </select>
      </div>

      {/* Description */}
      <div
        style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}
      >
        <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          Description
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="What's this habit about?"
          style={{
            padding: '8px',
            border: '1px solid #2d5016',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Commitment Time */}
      <div
        style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}
      >
        <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          Daily Commitment Time
        </label>
        <select
          name="commitmentTime"
          value={formData.commitmentTime}
          onChange={handleInputChange}
          style={{
            padding: '8px',
            border: '1px solid #2d5016',
            borderRadius: '4px',
          }}
        >
          {COMMITMENT_TIMES.map((time) => (
            <option key={time.value} value={time.value}>
              {time.label}
            </option>
          ))}
        </select>
      </div>

      {/* Image Preview */}
      <div
        style={{
          marginBottom: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <label style={{ fontWeight: 'bold', marginBottom: '10px' }}>
          Current Image
        </label>
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            style={{
              width: '150px',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '10px',
              border: '2px solid #2d5016',
            }}
          />
        )}
        {uploadedFileName && (
          <p style={{ fontSize: '12px', color: '#666' }}>
            ✓ {uploadedFileName}
          </p>
        )}
      </div>

      {/* Photo Grid */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
          Choose from presets
        </label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px',
          }}
        >
          {AVAILABLE_IMAGES.map((img) => (
            <div
              key={img.id}
              onClick={() => handleImageSelect(img)}
              style={{
                cursor: 'pointer',
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                border:
                  previewImage === img.image
                    ? '3px solid #2d5016'
                    : '2px solid #ddd',
                boxShadow:
                  previewImage === img.image
                    ? '0 0 10px rgba(45, 80, 22, 0.5)'
                    : 'none',
              }}
            >
              <img
                src={img.image}
                alt={img.name}
                style={{
                  width: '100%',
                  height: '80px',
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div
        style={{
          marginBottom: '15px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          Or upload your own image (max 500KB)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{
            padding: '8px',
            border: '1px solid #2d5016',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'space-between',
          marginTop: '20px',
        }}
      >
        <button
          onClick={handleDeleteClick}
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          <FaTrash size={16} /> Delete
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#999',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2d5016',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
