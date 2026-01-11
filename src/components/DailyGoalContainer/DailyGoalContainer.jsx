import { CircularProgressbar } from "react-circular-progressbar";
import { BsThreeDotsVertical } from "react-icons/bs";

function DailyGoalContainer({ DailyGoal, Title, engagementTime, buttonTitle, buttonAction, percentage }) {
    return (
        <div className='goals-card'>
            <div className='reading-card-header'>
                <div className='daily-goal-container'>
                    <h2 className='daily-goal'>{DailyGoal}</h2>
                </div>
                <BsThreeDotsVertical className='three-dots' />
            </div>
            <div className='habit-body'>
                <div className='reading-rate'>
                    <h2>{Title}</h2>
                    <div className='length-of-engagement'>{engagementTime}</div>
                </div>
                <div className='progress-circle'>
                    <CircularProgressbar className='percentage-circle' value={percentage} text={`${percentage}%`} />
                </div>
            </div>
            <div className='habit-footer'>
                <button className='mark-complete-button' onClick={buttonAction}>{buttonTitle}</button>

            </div>

        </div>);

}

export default DailyGoalContainer;