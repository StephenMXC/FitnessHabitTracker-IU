import React, { useState } from 'react';
import './habits.css';
import { FaPlus } from "react-icons/fa";
import { MdLocalFireDepartment } from "react-icons/md";

const Habits = () => {
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
            {/* card section */}
            <section className='currentstreak-totalhabits-completionrate-cards'>
                {/* Current Streak Card */}
                <div className='current-streak-card'>
                    <div className='card-header'>
                        <h2>Current Streak</h2>
                        <div className='logo'><MdLocalFireDepartment className='streak-icon'/></div>
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
                        <div className='logo'><MdLocalFireDepartment className='streak-icon'/></div>
                    </div>
                    <div className='body'>
                        <h1>12 Days</h1>
                        <p className='habits-from-last-week'> No change</p>
                    </div>
                </div>

                {/* Completion Rate Card */}
                <div className='current-streak-card'>
                    <div className='card-header'>
                        <h2>Completion Rate</h2>
                        <div className='logo'><MdLocalFireDepartment className='streak-icon'/></div>
                    </div>
                    <div className='body'>
                        <h1>12 Days</h1>
                        <p className='rate-from-last-week'> <FaPlus /> 5% improvement</p>
                    </div>
                </div>


            </section>

            <div className='habit-cards'>
                <div className='habit-header'>
                    <div className='daily-goal'> Daily Goal</div>
                </div>

                <div className='habit-body'>
                    <h1>Reading</h1>
                    <p>30 min/day </p>
                    <button className='mark-complete-button'>Mark Complete</button>
                </div>








            </div>
        </div>
    );
}
export default Habits;



