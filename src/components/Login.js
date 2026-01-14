import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'jobSeeker'
  });
  const navigate = useNavigate();

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

  return (
    <div className="login-container">
      <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#4CAF50' }}>
          FlexHire - Login
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <label>Login as:</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="jobSeeker">Job Seeker</option>
              <option value="jobProvider">Job Provider</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;