import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { Menu, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import './layout.css';

const Header = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Determine page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Overview Dashboard';
      case '/products':
        return 'Product Inventory';
      default:
        return 'Urban Harvest';
    }
  };

  return (
    <header className="header flex-between">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Toggle buttons for Sidebar */}
        <button 
          className="header-toggle" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ display: 'none', md: 'flex' }} // We handle in css or inline style responsive toggle
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <Menu size={20} className="desktop-menu-toggle" />
        </button>
        <button 
          className="header-toggle mobile-menu-btn" 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          title="Open Menu"
        >
          <Menu size={20} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--neutral-800)' }}>
          {getPageTitle()}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative', cursor: 'pointer', color: 'var(--neutral-600)' }}>
          <Bell size={20} />
          <span 
            style={{ 
              position: 'absolute', 
              top: '-2px', 
              right: '-2px', 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--primary-500)', 
              border: '2px solid white' 
            }}
          />
        </div>

        {/* User Profile dropdown */}
        <div 
          className="header-profile" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          ref={dropdownRef}
        >
          <img 
            className="header-avatar" 
            src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
            alt={user?.name || 'User Profile'} 
          />
          <div className="header-user-info" style={{ display: 'none', sm: 'flex' }}>
            <span className="header-username">{user?.name || 'Jane Doe'}</span>
            <span className="header-role">{user?.role || 'Administrator'}</span>
          </div>
          <ChevronDown size={14} color="var(--neutral-400)" />

          {dropdownOpen && (
            <div className="profile-dropdown">
              <div 
                style={{ 
                  padding: '10px 12px', 
                  borderBottom: '1px solid var(--neutral-100)',
                  marginBottom: '4px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                className="mobile-profile-details"
              >
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--neutral-800)' }}>
                  {user?.name || 'Jane Doe'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>
                  {user?.email || 'admin@urbanharvest.com'}
                </span>
              </div>
              <button className="dropdown-item" onClick={() => navigate('/dashboard')}>
                <User size={16} /> My Dashboard
              </button>
              <button className="dropdown-item" onClick={() => navigate('/products')}>
                <Settings size={16} /> Manage Inventory
              </button>
              <button className="dropdown-item logout" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        /* Extra responsive overrides for header toggles */
        .desktop-menu-toggle {
          display: block;
        }
        .mobile-menu-btn {
          display: none;
        }
        .mobile-profile-details {
          display: none !important;
        }
        @media (max-width: 768px) {
          .desktop-menu-toggle {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .header-user-info {
            display: none !important;
          }
          .mobile-profile-details {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
