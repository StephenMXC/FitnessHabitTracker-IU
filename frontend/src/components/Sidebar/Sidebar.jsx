// ============================================
// SIDEBAR COMPONENT
// ============================================
// PURPOSE: Navigation menu and logout button for authenticated users.
// FEATURES:
// - Links to Dashboard and Habits pages
// - Highlights current active page
// - Logout button that clears auth and redirects to login
// USAGE: <Sidebar /> (rendered by DefaultLayout)
// ============================================

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './sidebar.css';

function Sidebar() {
  const location = useLocation(); // Current page URL
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Navigation links
  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Fitness/Habits', path: '/habits' },
  ];

  // Handle logout and redirect to login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
      <div className="logout-container">
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
