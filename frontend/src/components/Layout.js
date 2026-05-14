import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/designs', label: 'Design Generation', icon: '🎨' },
  { path: '/maintenance', label: 'Maintenance', icon: '📅' },
  { path: '/irrigation', label: 'Irrigation', icon: '💧' },
  { path: '/materials', label: 'Materials', icon: '🧱' },
  { path: '/proposals', label: 'Proposals', icon: '📋' },
  { path: '/plants', label: 'Plant Database', icon: '🌿' },
  { path: '/costs', label: 'Cost Calculator', icon: '💰' },
  { path: '/projects', label: 'Projects', icon: '📊' },
  { path: '/soil', label: 'Soil Analysis', icon: '🔬' },
  { path: '/weather', label: 'Weather Plans', icon: '🌤️' },
  { path: '/equipment', label: 'Equipment', icon: '🚜' },
  { path: '/crews', label: 'Crew Scheduling', icon: '👷' },
  { path: '/gallery', label: 'Photo Gallery', icon: '📸' },
  { path: '/invoices', label: 'Invoices', icon: '🧾' },
  { path: '/suppliers', label: 'Suppliers', icon: '🏪' },
  { path: '/clients', label: 'Clients', icon: '👥' },
  { path: '/expenses', label: 'Expenses', icon: '💵' },
  { path: '/time-tracking', label: 'Time Tracking', icon: '⏱️' },
  { path: '/calculator', label: 'Calculator', icon: '🧮' },
  { path: '/reports', label: 'Reports', icon: '📊' },
  { path: '/profile', label: 'Profile', icon: '⚙️' },
  { path: '/ai-tools', label: 'AI Tools', icon: '✨' },
];

function Layout({ children, onLogout }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>🌳 LandscapeAI</h2>
          <p>Design & Estimator Pro</p>
        </div>
        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'active' : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="sidebar-user">
          <span>{user.name || 'User'}</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
