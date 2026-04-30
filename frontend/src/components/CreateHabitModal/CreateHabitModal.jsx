// ============================================
// CREATE HABIT MODAL - CONTAINER
// ============================================
// PURPOSE: Modal overlay container for creating new habits.
// RECEIVES: { isOpen, onClose, children, title }
// FEATURES:
// - Shows/hides based on isOpen prop
// - Allows click-outside to close (overlay)
// - Prevents propagation of inner clicks
// ============================================

import React from 'react';
import { FaTimes } from "react-icons/fa";
import './createHabitModal.css';

function CreateHabitModal({ isOpen, onClose, children, title }) {
    if (!isOpen) return null;

    return (
        <div className='create-modal-overlay' onClick={onClose}>
            <div className='create-modal-content' onClick={(e) => e.stopPropagation()}>
                <button className='create-modal-close' onClick={onClose}>
                    <FaTimes />
                </button>

                {title && <h1 className='create-modal-title'>{title}</h1>}

                {children}
            </div>
        </div>
    );
}

export default CreateHabitModal;
