import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav>
      <div>
        <Link to="/dashboard" style={{ 
          color: 'white', 
          textDecoration: 'none', 
          fontSize: '24px', 
          fontWeight: 'bold',
          marginRight: '30px'
        }}>
          FlexHire
        </Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/job-provider">{user?.userType === 'jobProvider' ? 'Post Jobs' : 'Find Jobs'}</Link>
        <Link to="/job-seeker">{user?.userType === 'jobSeeker' ? 'Browse Jobs' : 'View Workers'}</Link>
        <Link to="/profile">Profile</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>Welcome, {user?.name}</span>
        <span style={{
          backgroundColor: 'white',
          color: '#4CAF50',
          padding: '5px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {user?.userType === 'jobSeeker' ? 'Worker' : 'Provider'}
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
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;