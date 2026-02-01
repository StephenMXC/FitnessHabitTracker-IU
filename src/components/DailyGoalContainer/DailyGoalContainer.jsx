import { CircularProgressbar } from "react-circular-progressbar";
import { BsThreeDotsVertical } from "react-icons/bs";
import 'react-circular-progressbar/dist/styles.css';
import '../../pages/Habits/habits.css';


function DailyGoalContainer({
    dailyGoal,
    isActive,
    title,
    engagementTime,
    buttonTitle,
    image,
    buttonAction,
    deleteAction,
    percentage
}) {
    return (
        <div className='goals-card'>
            <div className='card-header' style={{ backgroundImage: `url(${image})` }}>
                <div className={`daily-goal-container ${isActive ? 'active' : ''}`}>
                    <h2 className='daily-goal'>{isActive ? dailyGoal : null}</h2>
                </div>
                <BsThreeDotsVertical className='three-dots' onClick={deleteAction} />
            </div>

            <div className='habit-body'>
                <div className='habit-info'>
                    <h2>{title}</h2>
                    <div className='engagement-time'>{engagementTime}</div>
                </div>
                <div className='progress-circle'>
                    <CircularProgressbar value={percentage} text={`${percentage}%`} />
                </div>
            </div>

            <div className='habit-footer'>
                <button className='mark-complete-button' onClick={buttonAction}>
                    {buttonTitle}
                </button>
            </div>
        </div>
    );
}

export default DailyGoalContainer;
