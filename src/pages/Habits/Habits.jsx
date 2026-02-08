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
import { CurrentHabitModal } from '../../components/CurrentHabitModal/CurrentHabitModal.jsx';
import { CurrentHabitForm } from '../../components/CurrentHabitModal/CurrentHabitForm.jsx';

const Habits = () => {
    const [percentages, setPercentages] = useState({
        reading: 0,
        stretching: 0,
        noSocialMedia: 0,
        meditation: 0,
    });

    const [habitsList, setHabitsList] = useState(HABITS_CARD_DATA);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCurrentHabitModal, setShowCurrentHabitModal] = useState(false);
    

    //  streak state (auto-resets on reload for demo purposes)
    const [streak, setStreak] = useState(0);
    const [lastStreakTimestamp, setLastStreakTimestamp] = useState(null);
    const [currentHabit, setCurrentHabit] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        completionRate: 0,
    });
    const [completionRateChanged, setCompletionRateChanged] = useState(false);


    const handleUpdateHabit = (updatedHabit) => {
        const rate = Number(updatedHabit.completionRate);

        setHabitsList(prevList =>
            prevList.map(habit =>
                habit.id === currentHabit.id
                    ? { ...habit, ...updatedHabit, completionRate: rate }
                    : habit
            )
        );

        setPercentages(prev => ({
            ...prev,
            [currentHabit.id]: rate,
        }));

        setShowCurrentHabitModal(false);
    };


    const handleDeleteHabit = (habitId) => {
        setHabitsList(prevList => prevList.filter(habit => habit.id !== habitId));
        setShowCurrentHabitModal(false);
    };
    const inputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const completionRateChange = (e) => {
        const value = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            completionRate: value,
        }));
        setCompletionRateChanged(true);
    };
    const keepCompletionRate = () => {
        setCompletionRateChanged(false);
    };

    const handleComplete = (id) => {
        const now = Date.now();

        // existing percentage logic
        setPercentages(p => ({
            ...p,
            [id]: Math.min((p[id] ?? 0) + 10, 100),
        }));

        // streak logic
        setStreak(prevStreak => {
            if (!lastStreakTimestamp) {
                setLastStreakTimestamp(now);
                return 1;
            }

            const hoursSinceLast =
                (now - lastStreakTimestamp) / (1000 * 60 * 60);

            if (hoursSinceLast <= 24) {
                // already counted for this window
                return prevStreak;
            }

            if (hoursSinceLast <= 48) {
                // next valid day
                setLastStreakTimestamp(now);
                return prevStreak + 1;
            }

            // missed a full day → reset
            setLastStreakTimestamp(now);
            return 1;
        });
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
        if (habitsList.length === 0) return 0;
        const habits = habitsList.map(habit => percentages[habit.id] || 0);
        const completionRate =
            habits.reduce((sum, value) => sum + value, 0) / habits.length;
        return Math.round(completionRate);
    };

    return (
        <div className='main-page-containter'>
            <section className="currentstreak-totalhabits-completionrate-cards">
                {STATS_CARD_DATA.map(stat => (
                    <StatCard
                        key={stat.id}
                        title={stat.title}
                        value={
                            stat.id === "habits"
                                ? String(HabitCards)
                                : stat.id === "rate"
                                ? completionRates() + "%"
                                : stat.id === "streak"
                                ? streak + " Days"
                                : stat.value
                        }
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
                        modalAction={() => {
                            setCurrentHabit(stat);
                            setShowCurrentHabitModal(true);
                        }}
                        buttonTitle={stat.buttonTitle}
                        engagementTime={stat.engagementTime}
                    />
                ))}

                <div className='new-goals-card'>
                    <div className='new-habit-button-container'>
                        <button
                            className='new-habit-button'
                            onClick={() => setShowCreateModal(true)}
                        >
                            <FaPlus /> New Habit
                        </button>
                    </div>
                </div>
            </section>

            <CreateHabitModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Habit"
            >
                <CreateHabitForm
                    onCreateHabit={handleCreateHabit}
                    onCancel={() => setShowCreateModal(false)}
                />
            </CreateHabitModal>

            <CurrentHabitModal
                isOpen={showCurrentHabitModal}
                onClose={() => setShowCurrentHabitModal(false)}
                habit={currentHabit}
                currentPercentage={percentages[currentHabit?.id] ?? 0}
                onSave={handleUpdateHabit}
                onDelete={handleDeleteHabit}
            >

                <CurrentHabitForm
                    formData={formData}
                    onInputChange={inputChange}
                    onCompletionRateChange={completionRateChange}
                    completionRateChanged={completionRateChanged}
                    onKeepCompletionRate={keepCompletionRate}
                />
            </CurrentHabitModal>
                    
        </div>
    );
};

export default Habits;
