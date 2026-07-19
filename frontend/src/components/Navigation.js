import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Navigation = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { t, language, changeLanguage, languages } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
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
        {/* App Logo & Name */}
        <Link
          to="/dashboard"
          style={{
            color: 'var(--color-accent_primary)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 16px',
            borderRadius: '25px',
            transition: 'all 0.3s ease',
            marginRight: '8px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg_hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="FlexHire - Connect Skills. Solve Needs. Instantly."
        >
          <span style={{
            fontSize: '28px',
            fontWeight: '900',
            letterSpacing: '2px',
          }}>
            FLEXHIRE
          </span>
        </Link>

        {/* Menu Links */}
        <Link to="/dashboard">📊 {t.dashboard}</Link>

        {user?.userType === 'jobProvider' ? (
          <Link to="/job-provider">➕ {t.postJobs}</Link>
        ) : (
          <Link to="/job-seeker">🔍 {t.browseJobs}</Link>
        )}

        <Link to="/blog">📝 Blog</Link>

        <Link to="/profile">👤 {t.profile}</Link>
      </div>

      {/* Right Side - User Info Panel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
        {/* Language Selector */}
        <div style={{ position: 'relative', marginRight: '8px' }}>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--color-text_primary)',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg_secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span>
              {languages.find((lang) => lang.code === language)?.flag || '🌐'}
            </span>
            <span>
              {languages.find((lang) => lang.code === language)?.name || 'English'}
            </span>
          </button>

          {showLanguageDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'var(--color-bg_primary)',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                zIndex: 1000,
                minWidth: '160px',
                marginTop: '8px',
                overflow: 'hidden',
              }}
            >
              {languages.map((lang, idx) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: 'none',
                    backgroundColor:
                      language === lang.code ? 'var(--color-bg_secondary)' : 'var(--color-bg_primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderBottom: idx < languages.length - 1 ? '1px solid var(--color-border)' : 'none',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg_secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = language === lang.code ? 'var(--color-bg_secondary)' : 'var(--color-bg_primary)'}
                >
                  <span>{lang.flag}</span>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-text_primary)',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '16px',
            transition: 'all 0.2s ease',
            title: isDarkMode ? 'Light Mode' : 'Dark Mode',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg_secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* User Info Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          paddingLeft: '8px', 
          paddingRight: '4px'
        }}>
          <span style={{
            color: 'var(--color-text_primary)',
            fontSize: '13px',
            fontWeight: '500',
            marginRight: '2px'
          }}>
            {user?.name}
          </span>

          <span
            style={{
              backgroundColor: 'var(--color-bg_secondary)',
              color: 'var(--color-text_primary)',
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '11px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg_tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg_secondary)'}
          >
            {user?.userType === 'jobSeeker' ? '👨‍💼' : '🏢'}
          </span>

          <button
            onClick={handleLogoutClick}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--color-text_secondary)',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg_secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            🚪
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
