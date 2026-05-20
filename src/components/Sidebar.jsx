import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  LogOut, 
  Settings, 
  Users, 
  Leaf, 
  X 
} from 'lucide-react';
import './layout.css';

const Sidebar = ({ isCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Products', icon: ShoppingBag, path: '/products' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false); // Close sidebar on mobile after navigating
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const currentPath = location.pathname;

  return (
    <>
      <aside 
        className={`sidebar glass-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
      >
        <div className="sidebar-logo">
          <Leaf className="sidebar-logo-icon" size={24} color="#62be78" fill="#2d7d41" />
          <span className="sidebar-logo-text">Urban<span>Harvest</span></span>
          {isMobileOpen && (
            <button 
              className="modal-close" 
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white' }}
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span className="sidebar-nav-label">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-nav-item" style={{ color: '#ef4444' }}>
            <LogOut size={20} />
            <span className="sidebar-nav-label">Sign Out</span>
          </button>
        </div>
      </aside>
      
      {/* Mobile background overlay */}
      {isMobileOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 95 }} 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
