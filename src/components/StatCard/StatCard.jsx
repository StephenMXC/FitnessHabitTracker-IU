import { MdLocalFireDepartment } from "react-icons/md";
import { CiViewList } from "react-icons/ci";
import { MdPieChart } from "react-icons/md";



function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="current-streak-card">
      <div className="card-header">
        <h2>{title}</h2>
        <div className="logo">
          {icon}
        </div>
      </div>
      <div>
        <h1>{value}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

export default StatCard;
