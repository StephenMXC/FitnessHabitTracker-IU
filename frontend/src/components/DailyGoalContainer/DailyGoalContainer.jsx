// ============================================
// DAILY GOAL CONTAINER COMPONENT
// ============================================
// PURPOSE: Display individual habit card with completion status and actions.
// RECEIVES:
// - title: habit name
// - image: habit image URL
// - engagementTime: commitment time label (e.g. "30 mins/day")
// - isCompleted: boolean - whether habit completed today
// - buttonAction: function to toggle completion status
// - modalAction: function to open edit modal
// DISPLAYS: Habit card with background image, status badge, and mark complete button
// ============================================

import { BsThreeDotsVertical } from "react-icons/bs";
import '../../pages/Habits/habits.css';

function DailyGoalContainer({
    dailyGoal,
    isActive,
    title,
    engagementTime,
    buttonTitle,
    image,
    buttonAction,
    modalAction,
    isCompleted
}) {
    return (
        <div className='goals-card'>
            <div className='card-header' style={{ backgroundImage: `url(${image})` }}>
                <div className="three-dots-container"><BsThreeDotsVertical className='three-dots' onClick={modalAction} /></div>
            </div>

            <div className='habit-body'>
                <div className='habit-info'>
                    <div className='habit-header-with-status'>
                        <h2>{title}</h2>
                        <div className={`daily-goal-badge ${isCompleted ? 'active' : ''}`}>
                            <h2 className='daily-goal'>{isCompleted ? '✓ Done' : 'Pending'}</h2>
                        </div>
                    </div>
                    <div className='engagement-time'>{engagementTime}</div>
                </div>
            </div>

            <div className='habit-footer'>
                <button className={`mark-complete-button ${isCompleted ? 'completed' : ''}`} onClick={buttonAction}>
                    {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
            </div>
        </div>
    );
}

export default DailyGoalContainer;
