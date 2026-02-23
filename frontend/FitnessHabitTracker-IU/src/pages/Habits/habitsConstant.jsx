// StatsOverview.jsx

import { FaPlus } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";
import { MdPieChart } from "react-icons/md";
import { MdLocalFireDepartment } from "react-icons/md";

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



