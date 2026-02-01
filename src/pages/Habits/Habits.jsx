import React, { useState } from 'react';
import './habits.css';
import { FaPlus } from "react-icons/fa";
import 'react-circular-progressbar/dist/styles.css';
import DailyGoalContainer from '../../components/DailyGoalContainer/DailyGoalContainer.jsx';
import CreateHabitModal from '../../components/CreateHabitModal/CreateHabitModal.jsx';
import CreateHabitForm from '../../components/CreateHabitModal/CreateHabitForm.jsx';
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
    const [habitsList, setHabitsList] = useState(HABITS_CARD_DATA);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleComplete = (id) => {
        setPercentages(p => ({
            ...p,
            [id]: Math.min(p[id] + 10, 100),
        }));
    };

    const handleCreateHabit = (newHabit) => {
        setHabitsList([...habitsList, newHabit]);
        setPercentages(p => ({
            ...p,
            [newHabit.id]: 0,
        }));
        setShowCreateModal(false);
    };

    let HabitCards = habitsList.length;

    const completionRates = () => {
        const habits = habitsList.map(habit => percentages[habit.id] || 0);
        const completionRate = habits.reduce((sum, value) => sum + value, 0) / habits.length;

        return Math.round(completionRate);
    }

    // below will be code for tracking the streaks of the habits. If the user, within 24 hours, marks a habit as complete, the streak increases by 1. If they miss a day, the streak resets to 0.

    const currentStreak = () => {
        const currentDate = new Date();
        let streak = 0;
        habitsList.forEach(habit => {
            const lastCompletedDate = new Date(habit.lastCompleted);
            const timeDiff = currentDate - lastCompletedDate;
            const daysDiff = timeDiff / (1000 * 3600 * 24);

            if (daysDiff <= 1) {
                streak += 1;
            }
        });
        return streak;
    }


    return (
        <div className='main-page-containter'>
            <section className="currentstreak-totalhabits-completionrate-cards">
                {STATS_CARD_DATA.map(stat => (
                    <StatCard
                        key={stat.id}
                        title={stat.title}
                        // here's what this does explicitly: 
                        // If HabitCards has a truthy value (i.e., there are habits in the list) and the stat.id is "habits",
                        // it uses the length of the habitsList (converted to a string) as the value. 
                        // Otherwise, it falls back to the original stat.value from STATS_CARD_DATA.
                        value={stat.id === "habits" ? String(HabitCards) : stat.id === "rate" ? completionRates(habitsList) + "%" : stat.id === "streak" ? currentStreak() + " Days" : stat.value}
                        icon={stat.icon}
                        subtitle={stat.subtitle}
                    />
                ))}
            </section>
            <section className='habit-cards'>
                {habitsList.map(stat => (
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
                        <button className='new-habit-button' onClick={() => setShowCreateModal(true)}><FaPlus /> New Habit</button>
                    </div>
                </div>
            </section>
            <CreateHabitModal
                isOpen={showCreateModal} // this is where isOpen is defined as a thing that checks the showCreateModal state.
                onClose={() => setShowCreateModal(false)} //this is where onClose is defined as a thing that runs a function to set the showCreateModal to false.
                title="Create New Habit"
            >
                <CreateHabitForm
                    onCreateHabit={handleCreateHabit}
                    onCancel={() => setShowCreateModal(false)}
                />
            </CreateHabitModal>
        </div>
    );
};


export default Habits;



