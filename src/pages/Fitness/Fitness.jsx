import React, { useState } from 'react';
import './fitness.css';
import gymImage from '../../assets/gymImage.png';
import { IoFitness } from "react-icons/io5";


const Fitness = () => {
    return (
        <div className="fitness-page">
            <div className="left-div">
                {/* the top section of the left div containing three divs */}
                <div className="left-div-header">

                    {/* header containing title, "start your journey" and motiv quotes. */}
                    <div className='fitnessApp-title'>
                        <IoFitness size={40} color="#4CAF50" /> <p>FitnessApp</p>
                    </div>
                    {/* the "Start your journey" middle section of the header of this div. */}
                    <div className="Start-your-journey">
                        <h1>Start Your Journey</h1>
                        <p>Create your account to unlock analytics and goals.</p>

                    </div>
                    {/* additional motivational quotes in the last section of the header of this div. */}
                    <div className="motivational-quotes">
                        <section className='left-one'>Your gateway to a better life.</section>
                        
                    </div>
                </div>
                {/* the body section of the left div containing input fields and a button */}
                <div className='left-div-body'>
                    <input type="text" placeholder="Username" className="input-field" />
                    <input type="email" placeholder="Email Address" className="input-field" />
                    <input type="tel" placeholder="Phone Number" className="input-field" />
                    <input type="password" placeholder="Password" className="input-field" />
                    <input type="password" placeholder="Confirm Password" className="input-field" />
                    <button className="create-account-button">Sign Up</button>

                </div>
                {/* the bottom section of the left div containing an "already have an account?" prompt */}
                <div className="left-div-footer">
                    <p>Already have an account? <a href="/login" className="login-link">Log In</a></p>
                </div>

            </div >
            <div className="right-div">
                <h1>Welcome to FitnessApp</h1>
                <p>Your ultimate companion for tracking workouts, monitoring progress, and achieving your fitness goals.</p>
            </div>
        </div>

    );
};

export default Fitness;