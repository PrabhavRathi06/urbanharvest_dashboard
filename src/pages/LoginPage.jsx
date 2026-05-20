import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, setRememberMe, clearError } from '../store/authSlice';
import { Mail, Lock, Check, Leaf, AlertCircle, Loader } from 'lucide-react';
import './pages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@urbanharvest.com');
  const [password, setPassword] = useState('admin123');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, error, loading, rememberMe } = useSelector(
    (state) => state.auth
  );

  // Clear previous errors when visiting page
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    
    const success = await dispatch(loginUser(email, password));
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleRememberToggle = () => {
    dispatch(setRememberMe(!rememberMe));
  };

  return (
    <div className="login-screen">
      {/* Left graphical panel */}
      <div className="login-left">
        <div className="login-brand">
          <Leaf size={28} color="#d1f3d9" fill="#3c9d53" />
          <span>Urban<span>Harvest</span></span>
        </div>
        <div className="login-left-content animate-fade-in">
          <h2 className="login-headline">Cultivating the Future of Fresh Food</h2>
          <p className="login-subtitle">
            Admin console to manage smart greenhouse inventory, view live orders, track customer revenue, and dispatch deliveries.
          </p>
        </div>
        <div className="login-left-footer">
          &copy; 2026 Urban Harvest Inc. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-form-header">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-desc">Please sign in to access your administrative panel.</p>
          </div>

          {error && (
            <div className="login-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label className="login-form-label" htmlFor="email-input">Email Address</label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="email-input"
                  type="email"
                  className="form-input"
                  placeholder="admin@urbanharvest.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="login-form-group">
              <label className="login-form-label" htmlFor="password-input">Password</label>
              <div className="input-icon-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="password-input"
                  type={passwordVisible ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--primary-600)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div className="login-form-options">
              <label className="remember-me-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberToggle}
                  disabled={loading}
                />
                <span>Remember me</span>
              </label>
              <a 
                href="#forgot" 
                className="forgot-password-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Please contact the Urban Harvest IT support desk to reset your administrator password.");
                }}
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-login"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-credentials-tip">
            <span style={{ fontWeight: 600, color: 'var(--neutral-700)' }}>Demo Admin Credentials:</span>
            <span>Email: <code>admin@urbanharvest.com</code></span>
            <span>Password: <code>admin123</code></span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
