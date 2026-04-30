import React from 'react';
import { FaTimes } from "react-icons/fa";
import './habitModal.css';

function HabitModal({ habit, percentage, isOpen, onClose, onButtonClick }) {
    if (!isOpen || !habit) return null;

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                <button className='modal-close' onClick={onClose}>
                    <FaTimes />
                </button>

                <div className='modal-image-container'>
                    <img 
                        src={habit.image} 
                        alt={habit.title} 
                        className='modal-image'
                    />
                </div>

                <div className='modal-body'>
                    <h1 className='modal-title'>{habit.title}</h1>
                    
                    <div className='modal-details'>
                        <div className='detail-item'>
                            <span className='detail-label'>Engagement Time:</span>
                            <span className='detail-value'>{habit.engagementTime}</span>
                        </div>

                        <div className='detail-item'>
                            <span className='detail-label'>Daily Goal:</span>
                            <span className='detail-value'>{habit.dailyGoal}</span>
                        </div>

                        <div className='detail-item'>
                            <span className='detail-label'>Status:</span>
                            <span className={`detail-value ${habit.isActive ? 'active' : 'inactive'}`}>
                                {habit.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    <button 
                        className='modal-button' 
                        onClick={onButtonClick}
                    >
                        {habit.buttonTitle}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HabitModal;
