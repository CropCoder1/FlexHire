import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import WorkerDashboard from './components/WorkerDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import JobProvider from './components/JobProvider';
import JobSeeker from './components/JobSeeker';
import Profile from './components/Profile';
import Blog from './components/Blog';
import Navigation from './components/Navigation';
import LoadingScreen from './components/LoadingScreen';
import Footer from './components/Footer';
import TestAccountSwitcher from './components/TestAccountSwitcher';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { getMe, isLoggedIn, getStoredUser, logout as apiLogout, login as apiLogin } from './utils/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in via JWT
    if (isLoggedIn()) {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
        // Verify token is still valid
        getMe().then(result => {
          if (result.success) {
            setUser(result.user);
            localStorage.setItem('flexhire_user', JSON.stringify(result.user));
          } else {
            // Token expired
            apiLogout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }).catch(() => {
          // Keep stored user if server is unreachable
        });
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoading(true);
    localStorage.setItem('flexhire_user', JSON.stringify(userData));
    setUser(userData);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleLogout = () => {
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleLoginAsTestUser = async (testAccount) => {
    setIsLoading(true);
    try {
      const result = await apiLogin(testAccount.email, 'test123');
      if (result.success) {
        const userData = result.user;
        localStorage.setItem('flexhire_user', JSON.stringify(userData));
        setUser(userData);
        setTimeout(() => {
          setIsAuthenticated(true);
          setIsLoading(false);
        }, 1000);
      } else {
        alert('Test login failed: ' + result.error);
        setIsLoading(false);
      }
    } catch (error) {
      alert('Test login failed: ' + error.message);
      setIsLoading(false);
    }
  };

  const updateUserProfile = (profileData) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('flexhire_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        {isLoading && <LoadingScreen />}
        <Router>
          <div className="App">
            {isAuthenticated && <Navigation user={user} onLogout={handleLogout} />}
            <div style={{ minHeight: 'calc(10vh - 60px)' }}>
              <Routes>
                <Route path="/login" element={
                  isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
                } />
              <Route path="/register" element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
              } />
              <Route path="/dashboard" element={
                isAuthenticated ? (
                  user?.user_type === 'jobSeeker' || user?.userType === 'jobSeeker' ? 
                    <WorkerDashboard user={user} /> : 
                    <ProviderDashboard user={user} />
                ) : <Navigate to="/login" />
              } />
              <Route path="/job-provider" element={
                isAuthenticated ? <JobProvider user={user} /> : <Navigate to="/login" />
              } />
              <Route path="/job-seeker" element={
                isAuthenticated ? <JobSeeker user={user} /> : <Navigate to="/login" />
              } />
              <Route path="/profile" element={
                isAuthenticated ? <Profile user={user} updateProfile={updateUserProfile} /> : <Navigate to="/login" />
              } />
              <Route path="/blog" element={
                isAuthenticated ? <Blog user={user} /> : <Navigate to="/login" />
              } />
              <Route path="/" element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              } />
            </Routes>
            </div>
            <Footer />
            <TestAccountSwitcher user={user} onLogout={handleLogout} onLoginAsTestUser={handleLoginAsTestUser} />
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;