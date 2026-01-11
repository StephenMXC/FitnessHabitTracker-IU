// StatsOverview.jsx

import { FaPlus } from "react-icons/fa";

export const STATS_CARD_DATA = [
  {
    id: "streak",
    title: "Current Streak",
    value: "12 Days",
    subtitle: (
      <span className="days-from-last-week">
        <FaPlus /> 2 days from last week
      </span>
    ),
  },
  {
    id: "habits",
    title: "Total Habits",
    value: "12",
    subtitle: (
      <span className="habits-from-last-week">
        No change
      </span>
    ),
  },
  {
    id: "rate",
    title: "Completion Rate",
    value: "85%",
    subtitle: (
      <span className="rate-from-last-week">
        <FaPlus /> 5% improvement
      </span>
    ),
  },
];



