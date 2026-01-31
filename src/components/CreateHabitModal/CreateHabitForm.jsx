import React, { useState } from 'react';
import readingImage from '../../assets/readingImage.jpg';
import stretchingImage from '../../assets/stretchingStonk.jpg';
import noSocialMediaImage from '../../assets/noSocialMedia.jpg';
import meditationImage from '../../assets/Meditate.jpg';
import gymImage from '../../assets/gymImage.png';

const AVAILABLE_IMAGES = [
    { id: 'reading', name: 'Reading', image: readingImage },
    { id: 'stretching', name: 'Stretching', image: stretchingImage },
    { id: 'noSocialMedia', name: 'No Social Media', image: noSocialMediaImage },
    { id: 'meditation', name: 'Meditation', image: meditationImage },
    { id: 'gym', name: 'Gym', image: gymImage },
];

const COMMITMENT_TIMES = [
    { value: '15', label: '15 mins/day' },
    { value: '30', label: '30 mins/day' },
    { value: '60', label: '1 hour/day' },
    { value: '120', label: '2 hours/day' },
    { value: '180', label: '3 hours/day' },
];

function CreateHabitForm({ onCreateHabit, onCancel }) {
    const [habitName, setHabitName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedCommitmentTime, setSelectedCommitmentTime] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);

    const handleCreateHabit = () => {
        if (!habitName.trim() || !selectedImage || !selectedCommitmentTime) {
            alert('Please fill in all fields');
            return;
        }

        let imageToUse;
        if (selectedImage === 'custom_upload') {
            imageToUse = uploadedImage;
        } else {
            const selectedImageData = AVAILABLE_IMAGES.find(img => img.id === selectedImage);
            imageToUse = selectedImageData.image;
        }

        const newHabit = {
            id: `custom_${Date.now()}`,
            isActive: false,
            dailyGoal: 'Pending',
            title: habitName,
            engagementTime: selectedCommitmentTime,
            buttonTitle: 'Mark Complete',
            image: imageToUse,
        };

        onCreateHabit(newHabit);
        setHabitName('');
        setSelectedImage(null);
        setSelectedCommitmentTime('');
        setUploadedImage(null);
    };

    return (
        <>
            {/* Habit Name Input */}
            <div className='form-group'>
                <label className='form-label'>Habit Name</label>
                <input
                    type='text'
                    className='form-input'
                    placeholder='Enter habit name (e.g., Yoga, Running)'
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                />
            </div>

            {/* Photo Selection */}
            <div className='form-group'>
                <label className='form-label'>Select Photo</label>
                <div className='photo-grid'>
                    {AVAILABLE_IMAGES.map(img => (
                        <div
                            key={img.id}
                            className={`photo-option ${selectedImage === img.id ? 'selected' : ''}`}
                            onClick={() => setSelectedImage(img.id)}
                        >
                            <img src={img.image} alt={img.name} />
                            <span className='photo-label'>{img.name}</span>
                        </div>
                    ))}
                    <label className={`photo-upload-option ${selectedImage === 'custom_upload' ? 'selected' : ''}`}>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        setUploadedImage(event.target.result);
                                        setSelectedImage('custom_upload');
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                }
                            }}
                            style={{ display: 'none' }}
                        />
                        <div className='upload-content'>
                            <span className='upload-icon'>📤</span>
                            <span className='upload-text'>Upload Photo</span>
                        </div>
                    </label>
                </div>
                {uploadedImage && selectedImage === 'custom_upload' && (
                    <div className='uploaded-preview'>
                        <img src={uploadedImage} alt='Uploaded preview' />
                    </div>
                )}
            </div>

            {/* Commitment Time Selection */}
            <div className='form-group'>
                <label className='form-label'>Daily Commitment</label>
                <select
                    className='form-select'
                    value={selectedCommitmentTime}
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

            {/* Buttons */}
            <div className='form-actions'>
                <button className='create-habit-button' onClick={handleCreateHabit}>
                    Create Habit
                </button>
                <button className='cancel-button' onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </>
    );
}

export default CreateHabitForm;
