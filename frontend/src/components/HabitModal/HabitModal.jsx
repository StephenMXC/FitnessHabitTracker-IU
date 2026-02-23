import React from 'react';
import { CircularProgressbar } from "react-circular-progressbar";
import { FaTimes } from "react-icons/fa";
import 'react-circular-progressbar/dist/styles.css';
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

                    <div className='modal-progress'>
                        <div className='progress-circle-large'>
                            <CircularProgressbar 
                                value={percentage} 
                                text={`${percentage}%`}
                            />
                        </div>
                        <div className='progress-info'>
                            <p className='progress-label'>Progress</p>
                            <p className='progress-percentage'>{percentage}% Complete</p>
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
