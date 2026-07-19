import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const lightTheme = {
  // Backgrounds
  bg_primary: '#FFFFFF',
  bg_secondary: '#F5F7FA',
  bg_tertiary: '#E8EBF0',
  bg_hover: '#F0F2F7',

  // Text colors
  text_primary: '#1A1A1A',
  text_secondary: '#4A4A4A',
  text_tertiary: '#9E9E9E',

  // Accent colors - Professional blue & orange gradient
  accent_primary: '#1E88E5',
  accent_secondary: '#FF6F00',
  accent_tertiary: '#43A047',

  // UI elements
  border: '#D0D5DC',
  shadow_light: 'rgba(0, 0, 0, 0.05)',
  shadow_medium: 'rgba(0, 0, 0, 0.1)',
  shadow_dark: 'rgba(0, 0, 0, 0.15)',

  // Status colors
  success: '#43A047',
  warning: '#FB8C00',
  danger: '#E53935',
  info: '#1E88E5',
};

const darkTheme = {
  // Backgrounds
  bg_primary: '#0F0F0F',
  bg_secondary: '#1A1A1A',
  bg_tertiary: '#252525',
  bg_hover: '#2D2D2D',

  // Text colors  
  text_primary: '#FFFFFF',
  text_secondary: '#D3D3D3',
  text_tertiary: '#888888',

  // Accent colors - Vibrant for dark mode
  accent_primary: '#42A5F5',
  accent_secondary: '#FFA726',
  accent_tertiary: '#66BB6A',

  // UI elements
  border: '#333333',
  shadow_light: 'rgba(0, 0, 0, 0.4)',
  shadow_medium: 'rgba(0, 0, 0, 0.6)',
  shadow_dark: 'rgba(0, 0, 0, 0.8)',

  // Status colors
  success: '#66BB6A',
  warning: '#FFA726',
  danger: '#EF5350',
  info: '#42A5F5',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme_mode');
    if (saved) {
      return saved === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    // Save theme preference
    localStorage.setItem('theme_mode', isDarkMode ? 'dark' : 'light');

    // Update CSS variables for global use
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Update body background
    document.body.style.backgroundColor = theme.bg_primary;
    document.body.style.color = theme.text_primary;
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [isDarkMode, theme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
