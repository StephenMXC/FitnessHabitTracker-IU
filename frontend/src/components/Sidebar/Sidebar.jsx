// Sidebar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './sidebar.css'; 

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Habits', path: '/habits' },
  ];

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
