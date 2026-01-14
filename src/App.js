import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import JobProvider from './components/JobProvider';
import JobSeeker from './components/JobSeeker';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('flexhire_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('flexhire_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('flexhire_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
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
            isAuthenticated ? <Profile user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;