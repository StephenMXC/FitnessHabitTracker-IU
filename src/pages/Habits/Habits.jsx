import React, { useState } from 'react';
import './habits.css';
import { FaPlus } from "react-icons/fa";
import { MdLocalFireDepartment } from "react-icons/md";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BsThreeDotsVertical } from "react-icons/bs";
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

    const handleComplete = (id) => {
        setPercentages(p => ({
            ...p,
            [id]: Math.min(p[id] + 10, 100),
        }));
    };

    return (
        <div className='main-page-containter'>
            <section className="currentstreak-totalhabits-completionrate-cards">
                {STATS_CARD_DATA.map(stat => (
                    <StatCard
                        key={stat.id}
                        title={stat.title}
                        value={stat.value}
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
                    />
                ))}
            </section>
        </div>
    );
};




// const Habits = () => {
//     const [percentage, setPercentage] = useState(66);
//     return (
//         // Main container for the habits page
//         <div className='main-page-containter'>
//             <div className='header'>   {/* Header Section */}
//                 <div className='daily-habits-build-consistency'>
//                     <h1>Your Daily Habits</h1>
//                     <p>Build consistency one step at a time.</p>
//                 </div>
//                 <div className='new-habit-button-container'>
//                     <button className='new-habit-button'><FaPlus /> New Habit</button>
//                 </div>

//             </div>
//             {/***************** card section *******************/}


//             <section className="currentstreak-totalhabits-completionrate-cards">
//                 {STATS_CARD_DATA.map(stat => (
//                     <StatCard
//                         key={stat.id}
//                         title={stat.title}
//                         value={stat.value}
//                         subtitle={stat.subtitle}
//                     />
//                 ))}
//             </section>



//             {/***************** Habit Cards ******************/}

            

//                 <section className='habit-cards'>
//                     {HABITS_CARD_DATA.map(stat => (
//                         <DailyGoalContainer
//                             key={stat.id}
//                             dailyGoal={stat.dailyGoal}
//                             title={stat.title}
//                             engagementTime={stat.engagementTime}
//                             buttonTitle={stat.buttonTitle}
//                             buttonAction={stat.buttonAction}
//                             percentage={stat.percentage}
//                         />
//                     ))}
//                 </section>


//         </div>
//     );
// }
export default Habits;



