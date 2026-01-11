// Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css'; 

function Sidebar() {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Fitness', path: '/fitness' },
    { name: 'Habits', path: '/habits' },
  ];

  return (
    <div className="sidebar">
      <h2>FitTrack</h2>
      <ul className="sidebar-links">
        {links.map(link => (
          <li key={link.path} className={location.pathname === link.path ? 'active' : ''}>
            <Link to={link.path}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
