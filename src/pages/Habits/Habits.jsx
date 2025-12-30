import React, { useState } from 'react';
import './habits.css';

const Habits = () => {
    const [habits, setHabits] = useState([]);
    const [input, setInput] = useState('');

    const addHabit = () => {
        if (input.trim()) {
            setHabits([...habits, { id: Date.now(), name: input, completed: false }]);
            setInput('');
        }
    };

    const toggleHabit = (id) => {
        setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
    };

    const deleteHabit = (id) => {
        setHabits(habits.filter(h => h.id !== id));
    };

    return (
        <div className="habits-container">
            <h1>My Habits</h1>
            <div className="habits-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add a new habit..."
                    onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                />
                <button onClick={addHabit}>Add</button>
            </div>
            <ul className="habits-list">
                {habits.map(habit => (
                    <li key={habit.id} className={`habit-item ${habit.completed ? 'completed' : ''}`}>
                        <input
                            type="checkbox"
                            checked={habit.completed}
                            onChange={() => toggleHabit(habit.id)}
                        />
                        <span>{habit.name}</span>
                        <button onClick={() => deleteHabit(habit.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default Habits;



