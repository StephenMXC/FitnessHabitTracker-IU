// ============================================
// HABIT CARDS - HABITS LIST COMPONENT
// ============================================
// PURPOSE: Display list of habit cards with completion status.
// RECEIVES:
// - habits: array of habit objects
// - percentages: completion percentages for each habit
// - onMarkComplete: callback to mark habit complete
// - onEdit: callback to open edit modal
// DISPLAYS: Grid of DailyGoalContainer components
// ============================================

import readingImage from '../../assets/readingImage.jpg';
import stretchingImage from '../../assets/stretchingStonk.jpg';
import noSocialMediaImage from '../../assets/noSocialMedia.jpg';
import meditationImage from '../../assets/Meditate.jpg';




export const HABITS_CARD_DATA = [
  {
    id: "reading",
    isActive: false,
    dailyGoal: "Completed",
    title: "Reading",
    engagementTime: "30 mins/day",
    buttonTitle: "Mark Complete",
    image: readingImage, 
  },
  {
    id: "stretching",
    isActive: false,
    dailyGoal: "Completed",
    title: "Stretching",
    engagementTime: "15 mins/day",
    buttonTitle: "Mark Complete",
    image: stretchingImage,
  },
  {
    id: "noSocialMedia",
    isActive: false,
    dailyGoal: "Completed",
    title: "No Social Media",
    engagementTime: "2 hrs/day",
    buttonTitle: "Mark Complete",
    image: noSocialMediaImage,
  },
  {
    id: "meditation",
    isActive: false,
    dailyGoal: "Completed",
    title: "Meditation",
    engagementTime: "10 mins/day",
    buttonTitle: "Mark Complete",
    image: meditationImage,
  },
];
