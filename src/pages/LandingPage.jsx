import React from 'react';
import './LandingPage.css';

export default function LandingPage() {
    return (
        <div className="landing-page">
            <header className="header">
                <h1>Fitness Tracker</h1>
                <nav>
                    <a href="#home">Home</a>
                    <a href="#workouts">Workouts</a>
                    <a href="#progress">Progress</a>
                    <a href="#profile">Profile</a>
                </nav>
            </header>

            <section className="hero">
                <h2>Welcome Back!</h2>
                <p>Track your fitness journey and achieve your goals</p>
            </section>

            <section className="dashboard">
                <div className="card">
                    <h3>Today's Workouts</h3>
                    <p>0 completed</p>
                    <button>View Workouts</button>
                </div>

                <div className="card">
                    <h3>Calories Burned</h3>
                    <p>0 kcal</p>
                    <button>Log Activity</button>
                </div>

                <div className="card">
                    <h3>Steps</h3>
                    <p>0 steps</p>
                    <button>View Details</button>
                </div>

                <div className="card">
                    <h3>Weekly Progress</h3>
                    <p>0% Complete</p>
                    <button>View Chart</button>
                </div>
            </section>

            <footer>
                <p>&copy; 2024 Fitness Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
}