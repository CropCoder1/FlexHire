import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'jobSeeker'
  });
  
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  const navigate = useNavigate();
  const { t, language, changeLanguage, languages } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  return (
    <div className="login-container">
      {/* Language Selector - Fixed Position */}
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
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
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
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              zIndex: 1000,
              minWidth: '150px',
              marginTop: '5px'
            }}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: 'none',
                    backgroundColor: language === lang.code ? '#f0f0f0' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#4CAF50' }}>
          {t.appName} - {t.login}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.email}:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t.email}
            />
          </div>

          <div className="form-group">
            <label>{t.password}:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={t.password}
            />
          </div>

          <div className="form-group">
            <label>{t.loginAs}:</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="jobSeeker">{t.jobSeeker}</option>
              <option value="jobProvider">{t.jobProvider}</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {t.login}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            {t.dontHaveAccount} <Link to="/register">{t.registerHere}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;