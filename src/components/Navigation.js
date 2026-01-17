import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navigation = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { t, language, changeLanguage, languages } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  return (
    <nav>
      <div>
        {/* App Name */}
        <Link
          to="/dashboard"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '24px',
            fontWeight: 'bold',
            marginRight: '30px',
          }}
        >
          {t.appName}
        </Link>

        {/* Menu Links */}
        <Link to="/dashboard">{t.dashboard}</Link>

        <Link to="/job-provider">
          {user?.userType === 'jobProvider' ? t.postJobs : t.browseJobs}
        </Link>

        {/* ✅ ONLY CHANGE IS HERE */}
        <Link to="/job-seeker">{t.findJob}</Link>

        <Link to="/profile">{t.profile}</Link>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* Language Selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            style={{
              backgroundColor: 'white',
              color: '#4CAF50',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>
              {languages.find((lang) => lang.code === language)?.flag || '🌐'}
            </span>
            <span>
              {languages.find((lang) => lang.code === language)?.name || 'English'}
            </span>
            <span>▼</span>
          </button>

          {showLanguageDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 1000,
                minWidth: '150px',
                marginTop: '5px',
              }}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: 'none',
                    backgroundColor:
                      language === lang.code ? '#f0f0f0' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <span>
          {t.welcome}, {user?.name}
        </span>

        <span
          style={{
            backgroundColor: 'white',
            color: '#4CAF50',
            padding: '5px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {user?.userType === 'jobSeeker' ? t.jobSeeker : t.jobProvider}
        </span>

        <button
          onClick={handleLogoutClick}
          style={{
            backgroundColor: 'white',
            color: '#4CAF50',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {t.logout}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
