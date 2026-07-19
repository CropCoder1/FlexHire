import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { register } from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', location: '', userType: 'jobSeeker', skills: ''
  });
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!/^\d{10}/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone must be at least 10 digits';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData.userType === 'jobSeeker' && !formData.skills.trim()) newErrors.skills = 'Skills are required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        phone: formData.phone,
        location: formData.location,
        skills: formData.userType === 'jobSeeker' ? formData.skills : ''
      });

      if (result.success) {
        setErrors({});
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        setErrors({ email: result.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ email: error.message || 'An error occurred during registration.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--color-accent_primary)', letterSpacing: '3px', marginBottom: '8px' }}>FLEXHIRE</div>
          <p style={{ fontSize: '13px', color: 'var(--color-accent_secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', margin: '0 0 20px 0' }}>Connect Skills. Solve Needs. Instantly.</p>
          <h1 className="register-title">🚀 {t.register}</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className={`form-group ${focusedField === 'name' ? 'focused' : ''} ${errors.name ? 'error' : ''}`}>
            <label>👤 {t.fullName}</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField('')} placeholder="John Doe" />
            </div>
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className={`form-group ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''}`}>
            <label>✉️ {t.email}</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} placeholder="your@email.com" />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className={`form-group ${focusedField === 'phone' ? 'focused' : ''} ${errors.phone ? 'error' : ''}`}>
            <label>📱 {t.phoneNumber}</label>
            <div className="input-wrapper">
              <span className="input-icon">📱</span>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField('')} placeholder="1234567890" />
            </div>
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className={`form-group ${focusedField === 'location' ? 'focused' : ''} ${errors.location ? 'error' : ''}`}>
            <label>📍 {t.location}</label>
            <div className="input-wrapper">
              <span className="input-icon">📍</span>
              <input type="text" name="location" value={formData.location} onChange={handleChange}
                onFocus={() => setFocusedField('location')} onBlur={() => setFocusedField('')} placeholder="City, Country" />
            </div>
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          {formData.userType === 'jobSeeker' && (
            <div className={`form-group ${focusedField === 'skills' ? 'focused' : ''} ${errors.skills ? 'error' : ''}`}>
              <label>🔧 {t.skills}</label>
              <div className="input-wrapper">
                <span className="input-icon">🔧</span>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange}
                  onFocus={() => setFocusedField('skills')} onBlur={() => setFocusedField('')} placeholder="e.g., Electrician, Plumber, Carpenter" />
              </div>
              {errors.skills && <span className="error-text">{errors.skills}</span>}
            </div>
          )}

          <div className={`form-group ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'error' : ''}`}>
            <label>🔒 {t.password}</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('')} placeholder="••••••••" />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className={`form-group ${focusedField === 'confirmPassword' ? 'focused' : ''} ${errors.confirmPassword ? 'error' : ''}`}>
            <label>🔐 {t.confirmPassword}</label>
            <div className="input-wrapper">
              <span className="input-icon">🔐</span>
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField('')} placeholder="••••••••" />
              <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <div className={`form-group ${focusedField === 'userType' ? 'focused' : ''}`}>
            <label>🎯 {t.registerAs}</label>
            <div className="selector-row">
              <div className="user-type-selector bottom">
              <button type="button" className={`type-btn ${formData.userType === 'jobSeeker' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, userType: 'jobSeeker' })}>
                <span className="type-icon">👨‍💼</span>
                <span className="type-label">{t.skilledWorker}</span>
              </button>
              <button type="button" className={`type-btn ${formData.userType === 'jobProvider' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, userType: 'jobProvider' })}>
                <span className="type-icon">🏢</span>
                <span className="type-label">{t.jobProvider}</span>
              </button>
              </div>
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            <span className="btn-text">{loading ? '⏳ Creating account...' : `🎉 ${t.register}`}</span>
            <span className="btn-icon">{loading ? '⏳' : '→'}</span>
          </button>

          <p className="login-link">
            {t.alreadyHaveAccount} <Link to="/login">🔑 {t.loginHere}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;