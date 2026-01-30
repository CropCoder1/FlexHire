import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'jobSeeker'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  
  const navigate = useNavigate();
  const { t, language, changeLanguage, languages } = useLanguage();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const userData = {
      id: Date.now(),
      email: formData.email,
      name: formData.email.split('@')[0],
      userType: formData.userType,
      location: 'Rural Area',
      rating: 0,
      jobsCompleted: 0
    };
    
    onLogin(userData);
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  return (
    <div className="login-container">
      {/* Language Selector */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        right: '20px',
        zIndex: 100 
      }}>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)';
            }}
          >
            <span>{languages.find(lang => lang.code === language)?.flag || '🌐'}</span>
            <span>{languages.find(lang => lang.code === language)?.name || 'English'}</span>
            <span>▼</span>
          </button>
          
          {showLanguageDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              zIndex: 1000,
              minWidth: '160px',
              marginTop: '8px',
              overflow: 'hidden',
              animation: 'slideUp 0.3s ease-out'
            }}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: language === lang.code ? '#f0f3ff' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'all 0.2s ease',
                    fontWeight: language === lang.code ? '700' : '500',
                    color: language === lang.code ? '#667eea' : '#333'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f9f9f9';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = language === lang.code ? '#f0f3ff' : 'white';
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-badge">🔑</div>
          <h1 className="login-title">🔑 {t.login}</h1>
          <p className="register-subtitle">👋 Welcome back to {t.appName}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Field */}
          <div className={`form-group ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''}`}>
            <label>✉️ {t.email}</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className={`form-group ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'error' : ''}`}>
            <label>🔒 {t.password}</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* User Type Selection */}
          <div className={`form-group ${focusedField === 'userType' ? 'focused' : ''}`}>
            <label>🎯 {t.loginAs}</label>
            <div className="user-type-selector">
              <button
                type="button"
                className={`type-btn ${formData.userType === 'jobSeeker' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, userType: 'jobSeeker' })}
              >
                <span className="type-icon">👨‍💼</span>
                <span className="type-label">{t.skilledWorker}</span>
              </button>
              <button
                type="button"
                className={`type-btn ${formData.userType === 'jobProvider' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, userType: 'jobProvider' })}
              >
                <span className="type-icon">🏢</span>
                <span className="type-label">{t.jobProvider}</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="register-btn">
            <span className="btn-text">🎉 {t.login}</span>
            <span className="btn-icon">→</span>
          </button>

          {/* Register Link */}
          <p className="login-link">
            {t.dontHaveAccount} <Link to="/register">✨ {t.registerHere}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;