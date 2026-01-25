import React, { useState } from 'react';
import './habits.css';
import { FaPlus } from "react-icons/fa";
import 'react-circular-progressbar/dist/styles.css';
import DailyGoalContainer from '../../components/DailyGoalContainer/DailyGoalContainer.jsx';
import StatCard from '../../components/StatCard/StatCard.jsx';
import { STATS_CARD_DATA } from './habitsConstant.jsx';
import { HABITS_CARD_DATA } from './HabitCards.jsx';

const Habits = () => {
    const [percentages, setPercentages] = useState({
        reading: 66,
        stretching: 40,
        noSocialMedia: 80,
        meditation: 20,
    });
    const [showPopup, setShowPopup] = useState(false);

    const handleComplete = (id) => {
        setPercentages(p => ({
            ...p, // Creating a new object that copies all existing percentages because states are immutable.
            [id]: Math.min(p[id] + 10, 100), // [id] is the habit name (reading, stretching, etc.) and this line says "take this habit's current percentage and add 10 to it, but do not exceed 100". 
        }));
    };
    const newHabitCard = () => {
        // Logic to add a new habit card
    };

    // Popup form handler
    const popupForm = (
        <div className="popup">
            <form>
                <input placeholder="Habit Name" />

                <select name="commitmentTime" defaultValue="">
                    <option value="" disabled>
                        Commitment time
                    </option>
                    <option value="15">15 mins/day</option>
                    <option value="30">30 mins/day</option>
                    <option value="60">1 hour/day</option>
                    <option value="120">2 hours/day</option>
                    <option value="180">3 hours/day</option>
                </select>

                <button type="submit" onClick={newHabitCard()}>Submit</button>
            </form>
        </div>
    );




    return (
        <div className='main-page-containter'>
            <section className="currentstreak-totalhabits-completionrate-cards">
                {STATS_CARD_DATA.map(stat => (
                    <StatCard
                        key={stat.id}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        subtitle={stat.subtitle}
                    />
                ))}
            </section>
            <section className='habit-cards'>
                {HABITS_CARD_DATA.map(stat => (
                    <DailyGoalContainer
                        key={stat.id}
                        {...stat}
                        percentage={percentages[stat.id]}
                        buttonAction={() => handleComplete(stat.id)}
                        buttonTitle={stat.buttonTitle}
                        engagementTime={stat.engagementTime}

                    />
                ))}
                <div className='new-goals-card'>
                    <div className='new-habit-button-container'>
                        <button className='new-habit-button' onClick={() => setShowPopup(true)}><FaPlus /> New Habit</button>
                        {showPopup && popupForm}
                    </div>
                </div>
            </section>
        </div>
    );
};


export default Habits;



