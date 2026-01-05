import React, { useState } from 'react';
import './habits.css';
import { FaPlus } from "react-icons/fa";
import { MdLocalFireDepartment } from "react-icons/md";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BsThreeDotsVertical } from "react-icons/bs";

const Habits = () => {
    const [percentage, setPercentage] = useState(66);
    return (
        <div className='main-page-containter'>
            <div className='header'>
                <div className='daily-habits-build-consistency'>
                    <h1>Your Daily Habits</h1>
                    <p>Build consistency one step at a time.</p>
                </div>
                <div className='new-habit-button-container'>
                    <button className='new-habit-button'><FaPlus /> New Habit</button>
                </div>

            </div>
            {/***************** card section *******************/}
            <section className='currentstreak-totalhabits-completionrate-cards'>
                {/* Current Streak Card */}
                <div className='current-streak-card'>
                    <div className='card-header'>
                        <h2>Current Streak</h2>
                        <div className='logo'><MdLocalFireDepartment className='streak-icon' /></div>
                    </div>
                    <div>
                        <h1>12 Days</h1>
                        <p className='days-from-last-week'> <FaPlus />  2 days from last week</p>
                    </div>
                </div>

                {/* Total Habits Card */}
                <div className='current-streak-card'>
                    <div className='card-header'>
                        <h2>Total Habits</h2>
                        <div className='logo'><MdLocalFireDepartment className='streak-icon' /></div>
                    </div>
                    <div>
                        <h1>12 Days</h1>
                        <p className='habits-from-last-week'> No change</p>
                    </div>
                </div>

                {/* Completion Rate Card */}
                <div className='current-streak-card'>
                    <div className='card-header'>
                        <h2>Completion Rate</h2>
                        <div className='logo'><MdLocalFireDepartment className='streak-icon' /></div>
                    </div>
                    <div>
                        <h1>12 Days</h1>
                        <p className='rate-from-last-week'> <FaPlus /> 5% improvement</p>
                    </div>
                </div>


            </section>

            {/***************** Habit Cards ******************/}
            {/* Reading Card */}
            <div className='habit-cards'>
                <div className='goals-card'>
                    <div className='reading-card-header'>
                        <div className='daily-goal-container'>
                            <h2 className='daily-goal'>Daily Goal</h2>
                        </div>
                        <BsThreeDotsVertical className='three-dots' />
                    </div>
                    <div className='habit-body'>
                        <div className='reading-rate'>
                            <h2>Reading</h2>
                            <div className='length-of-engagement'>30 mins/day</div>
                        </div>
                        <div className='progress-circle'>
                            <CircularProgressbar className='percentage-circle' value={percentage} text={`${percentage}%`} />
                        </div>
                    </div>
                    <div className='habit-footer'> 
                        <button className='mark-complete-button'>Mark Complete</button>

                    </div>

                </div>

                {/* Stretching Card */}
                <div className='goals-card'>
                    <div className='stretching-card-header'>
                        <div className='daily-goal-container'>
                            <h2 className='daily-goal'>Completed</h2>
                        </div>
                        <BsThreeDotsVertical className='three-dots' />
                    </div>
                    <div className='stretching-body'>
                        <div className='reading-rate'>
                            <h2>Stretching</h2>
                            <div className='length-of-engagement'>15 mins/day</div>
                        </div>
                        <div className='progress-circle'>
                            <CircularProgressbar className='percentage-circle' value={percentage} text={`${percentage}%`} />
                        </div>
                    </div>
                    <div className='habit-footer'>
                        <button className='mark-complete-button'>Done for today</button>

                    </div>

                </div>

                {/* No Social Media Card */}
                <div className='goals-card'>
                    <div className='no-social-media-card-header'>
                        {/* <div className='daily-nosocialmedia-goal-container'>
                            <h2 className='daily-goal'>No Social Media</h2>
                        </div> */}
                        <BsThreeDotsVertical className='three-dots' />
                    </div>
                    <div className='habit-body'>
                        <div className='reading-rate'>
                            <h2>No Social Media</h2>
                            <div className='length-of-engagement'>Until 6PM</div>
                        </div>
                        <div className='progress-circle'>
                            <CircularProgressbar className='percentage-circle' value={percentage} text={`${percentage}%`} />
                        </div>
                    </div>
                    <div className='habit-footer'>
                        <button className='mark-complete-button'>Check In</button>

                    </div>

                </div>

                {/* Meditation Card */}
                <div className='goals-card'>
                    <div className='meditation-card-header'>
                        {/* <div className='daily-goal-container'>
                            <h2 className='daily-goal'>Daily Goal</h2>
                        </div> */}
                        <BsThreeDotsVertical className='three-dots' />
                    </div>
                    <div className='habit-body'>
                        <div className='reading-rate'>
                            <h2>Meditation</h2>
                            <div className='length-of-engagement'>10 mins/day</div>
                        </div>
                        <div className='progress-circle'>
                            <CircularProgressbar className='percentage-circle' value={percentage} text={`${percentage}%`} />
                        </div>
                    </div>
                    <div className='habit-footer'>
                        <button className='mark-complete-button'>Mark Complete</button>

                    </div>

                </div>
            </div>
        </div>
    );
}
export default Habits;



