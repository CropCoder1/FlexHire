import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { login } from '../utils/api';

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
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { t, language, changeLanguage, languages } = useLanguage();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        const userData = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          userType: result.user.user_type,
          user_type: result.user.user_type,
          location: result.user.location || '',
          rating: result.user.rating || 0,
          jobsCompleted: result.user.jobs_completed || 0,
          phone: result.user.phone || '',
          skills: result.user.skills || '',
          bio: result.user.bio || '',
          experience: result.user.experience || ''
        };
        onLogin(userData);
        navigate('/dashboard');
      } else {
        setErrors({ email: result.error || 'Login failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ email: error.message || 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  return (
    <div className="login-container">
      {/* Language Selector */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
              color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 16px',
              borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex',
              alignItems: 'center', gap: '8px', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)'
            }}
          >
            <span>{languages.find(lang => lang.code === language)?.flag || '🌐'}</span>
            <span>{languages.find(lang => lang.code === language)?.name || 'English'}</span>
            <span>▼</span>
          </button>
          {showLanguageDropdown && (
            <div style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', zIndex: 1000, minWidth: '160px', marginTop: '8px', overflow: 'hidden' }}>
              {languages.map((lang) => (
                <button key={lang.code} onClick={() => handleLanguageChange(lang.code)}
                  style={{ width: '100%', padding: '12px 16px', border: 'none', backgroundColor: language === lang.code ? '#f0f3ff' : 'white', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f0f0f0', fontWeight: language === lang.code ? '700' : '500', color: language === lang.code ? '#667eea' : '#333' }}>
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
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--color-accent_primary)', letterSpacing: '3px', marginBottom: '8px' }}>FLEXHIRE</div>
          <p style={{ fontSize: '13px', color: 'var(--color-accent_secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', margin: '0 0 20px 0' }}>Connect Skills. Solve Needs. Instantly.</p>
          <h1 className="login-title">🔑 {t.login}</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className={`form-group ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''}`}>
            <label>✉️ {t.email}</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} placeholder="your@email.com" />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className={`form-group ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'error' : ''}`}>
            <label>🔒 {t.password}</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('')} placeholder="••••••••" />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="register-btn" disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            <span className="btn-text">{loading ? '⏳ Logging in...' : `🎉 ${t.login}`}</span>
            <span className="btn-icon">{loading ? '⏳' : '→'}</span>
          </button>

          <p className="login-link">
            {t.dontHaveAccount} <Link to="/register">✨ {t.registerHere}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;