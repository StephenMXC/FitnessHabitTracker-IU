// StatsOverview.jsx

import { FaPlus } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";
import { MdPieChart } from "react-icons/md";
import { MdLocalFireDepartment } from "react-icons/md";
import readingImage from '../../assets/readingImage.jpg';
import stretchingImage from '../../assets/stretchingStonk.jpg';
import noSocialMediaImage from '../../assets/noSocialMedia.jpg';
import meditationImage from '../../assets/Meditate.jpg';
import gymImage from '../../assets/gymImage.png';

export const STATS_CARD_DATA = [
  {
    id: "streak",
    title: "Current Streak",
    value: "12 Days",
    icon: <MdLocalFireDepartment className="streak-icon" />,
  },
  {
    id: "habits",
    title: "Total Habits",
    icon: <CiViewList className="streak-icon" />,
    value: "4",
  },
  {
    id: "rate",
    title: "Completion Rate",
    value: "85%",
    icon: <MdPieChart className="streak-icon" />,
  },
];

export const AVAILABLE_IMAGES = [
  { id: 'reading', name: 'Reading', image: readingImage },
  { id: 'stretching', name: 'Stretching', image: stretchingImage },
  { id: 'noSocialMedia', name: 'No Social Media', image: noSocialMediaImage },
  { id: 'meditation', name: 'Meditation', image: meditationImage },
  { id: 'gym', name: 'Gym', image: gymImage },
];

export const COMMITMENT_TIMES = [
  { value: '15', label: '15 mins/day' },
  { value: '30', label: '30 mins/day' },
  { value: '45', label: '45 mins/day' },
  { value: '60', label: '1 hour/day' },
  { value: '120', label: '2 hours/day' },
  { value: '180', label: '3 hours/day' },
];

export function formatCommitmentTime(value) {
  if (!value) return '30 mins/day';

  const match = COMMITMENT_TIMES.find(
    (option) => option.value === value || option.label === value
  );

  if (match) return match.label;

  if (/^\d+$/.test(value)) {
    const numeric = Number(value);
    if (numeric === 60) return '1 hour/day';
    if (numeric === 120) return '2 hours/day';
    if (numeric === 180) return '3 hours/day';
    return `${numeric} mins/day`;
  }

  return value;
}

export function getCommitmentValue(value) {
  if (!value) return '30';

  const match = COMMITMENT_TIMES.find(
    (option) => option.value === value || option.label === value
  );

  return match ? match.value : '30';
}



