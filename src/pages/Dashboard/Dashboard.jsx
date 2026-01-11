import React, { useState } from 'react';
import './dashboard.css';
import gymImage from '../../assets/gymImage.png';


const Dashboard = () => {
    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
            </div>
            <div className="dashboard-content">
                <p>Welcome to your dashboard! Here you can track your fitness and habits progress.</p>
            </div>
        </div>

    );
};

export default Dashboard;