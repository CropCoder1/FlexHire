import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    userType: 'jobSeeker',
    skills: ''
  });
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    alert('Registration successful! Please login.');
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="register-container">
      <div className="card" style={{ maxWidth: '500px', margin: '30px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#4CAF50' }}>
          {t.appName} - {t.register}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.fullName}:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={t.fullName}
            />
          </div>

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
            <label>{t.phoneNumber}:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder={t.phoneNumber}
            />
          </div>

          <div className="form-group">
            <label>{t.location}:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder={t.location}
            />
          </div>

          <div className="form-group">
            <label>{t.registerAs}:</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="jobSeeker">{t.skilledWorker}</option>
              <option value="jobProvider">{t.jobProvider}</option>
            </select>
          </div>

          {formData.userType === 'jobSeeker' && (
            <div className="form-group">
              <label>{t.skills}:</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., Electrician, Plumber, Carpenter"
              />
            </div>
          )}

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
            <label>{t.confirmPassword}:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder={t.confirmPassword}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {t.register}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            {t.alreadyHaveAccount} <Link to="/login">{t.loginHere}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;