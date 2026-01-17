import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import JobProvider from './components/JobProvider';
import JobSeeker from './components/JobSeeker';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import { LanguageProvider } from './context/LanguageContext';
import dataManager from './utils/dataManager';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('flexhire_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Ensure user exists in shared data
      const existingUser = dataManager.getUserById(userData.id);
      if (!existingUser) {
        // Add missing user data to shared storage
        const userProfile = localStorage.getItem(`flexhire_profile_${userData.id}`);
        const fullUserData = {
          ...userData,
          phone: '',
          skills: '',
          experience: '',
          bio: '',
          ...(userProfile ? JSON.parse(userProfile) : {})
        };
        dataManager.addUser(fullUserData);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    // Save to shared data manager
    const existingUser = dataManager.getUserById(userData.id);
    
    if (!existingUser) {
      // Add new user to shared data
      const userProfile = localStorage.getItem(`flexhire_profile_${userData.id}`);
      const fullUserData = {
        ...userData,
        phone: '',
        skills: '',
        experience: '',
        bio: '',
        ...(userProfile ? JSON.parse(userProfile) : {})
      };
      dataManager.addUser(fullUserData);
    }
    
    localStorage.setItem('flexhire_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('flexhire_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Function to sync user profile with shared data
  const updateUserProfile = (profileData) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      
      // Update shared data
      dataManager.getData().users = dataManager.getData().users.map(u => 
        u.id === user.id ? { ...u, ...profileData } : u
      );
      dataManager.saveData(dataManager.getData());
      
      // Update local storage
      localStorage.setItem(`flexhire_profile_${user.id}`, JSON.stringify(profileData));
    }
  };

  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          {isAuthenticated && <Navigation user={user} onLogout={handleLogout} />}
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
            } />
            <Route path="/dashboard" element={
              isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />
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
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            } />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;