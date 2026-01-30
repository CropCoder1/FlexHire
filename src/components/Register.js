import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    idType: '',
    idNumber: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    userType: 'jobSeeker',
    skills: ''
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
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

    // ID type & number required
    if (!formData.idType) {
      newErrors.idType = t.idTypeRequired || 'ID type is required';
    } else if (!validateIdNumber(formData.idType, formData.idNumber)) {
      newErrors.idNumber = t.idNumberInvalid || 'ID number is invalid for selected ID type';
    }

    if (!otpVerified) newErrors.idVerification = t.idVerifyRequired || 'Please verify your identity using an ID and OTP';

    return newErrors;
  };

  const validateIdNumber = (type, number) => {
    if (!type) return false;
    const v = (number || '').trim();
    if (!v) return false;
    if (type === 'aadhaar') return /^\d{12}$/.test(v.replace(/\s+/g, ''));
    if (type === 'pan') return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(v);
    if (type === 'voter') return /^[A-Z0-9]{6,12}$/i.test(v);
    if (type === 'driving') return /^.{6,20}$/.test(v);
    return false;
  };

  const handleSendOtp = () => {
    // basic validation
    if (!formData.idType) {
      setErrors({ ...errors, idType: 'Select ID type' });
      return;
    }
    if (!validateIdNumber(formData.idType, formData.idNumber)) {
      setErrors({ ...errors, idNumber: 'Enter a valid ID number for selected ID type' });
      return;
    }
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtp('');
    setOtpVerified(false);
    // Demo: show OTP so tester can verify. In production, integrate real OTP API.
    alert(`Demo OTP (use to verify): ${code}`);
  };

  const handleVerifyOtp = () => {
    if (!otpSent) return setErrors({ ...errors, idVerification: 'Send OTP first' });
    if (otp === String(generatedOtp)) {
      setOtpVerified(true);
      setErrors({ ...errors, idVerification: '' });
      return;
    }
    setOtpVerified(false);
    setErrors({ ...errors, idVerification: 'OTP is incorrect' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    alert('Registration successful! Please login.');
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-badge">🚀</div>
          <h1 className="register-title">🚀 {t.register}</h1>
          <p className="register-subtitle">✨ Join {t.appName} today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          {/* Name Field */}
          <div className={`form-group ${focusedField === 'name' ? 'focused' : ''} ${errors.name ? 'error' : ''}`}>
            <label>👤 {t.fullName}</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField('')}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className={`form-group ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''}`}>
            <label>✉️ {t.email}</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Phone Field */}
          <div className={`form-group ${focusedField === 'phone' ? 'focused' : ''} ${errors.phone ? 'error' : ''}`}>
            <label>📱 {t.phoneNumber}</label>
            <div className="input-wrapper">
              <span className="input-icon">📱</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField('')}
                placeholder="1234567890"
              />
            </div>
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* Location Field */}
          <div className={`form-group ${focusedField === 'location' ? 'focused' : ''} ${errors.location ? 'error' : ''}`}>
            <label>📍 {t.location}</label>
            <div className="input-wrapper">
              <span className="input-icon">📍</span>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onFocus={() => setFocusedField('location')}
                onBlur={() => setFocusedField('')}
                placeholder="City, Country"
              />
            </div>
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          {/* (moved) Register as will appear near the bottom for a cleaner layout */}

          {/* Skills Field (conditional) */}
          {formData.userType === 'jobSeeker' && (
            <div className={`form-group ${focusedField === 'skills' ? 'focused' : ''} ${errors.skills ? 'error' : ''}`}>
              <label>🔧 {t.skills}</label>
              <div className="input-wrapper">
                <span className="input-icon">🔧</span>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('skills')}
                  onBlur={() => setFocusedField('')}
                  placeholder="e.g., Electrician, Plumber, Carpenter"
                />
              </div>
              {errors.skills && <span className="error-text">{errors.skills}</span>}
            </div>
          )}

          {/* ID Verification Section */}
          <div className={`form-group ${errors.idVerification || errors.idType || errors.idNumber ? 'error' : ''}`}>
            <label>🆔 {t.idVerificationTitle}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <select
                name="idType"
                value={formData.idType}
                onChange={(e) => { setFormData({ ...formData, idType: e.target.value }); setErrors({ ...errors, idType: '' }); }}
                onFocus={() => setFocusedField('idType')}
                onBlur={() => setFocusedField('')}
              >
                <option value="">{t.selectIdType}</option>
                <option value="aadhaar">{t.idAadhaar}</option>
                <option value="pan">{t.idPan}</option>
                <option value="voter">{t.idVoter}</option>
                <option value="driving">{t.idDriving}</option>
              </select>

              <div className="input-wrapper">
                <span className="input-icon">📝</span>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => { setFormData({ ...formData, idNumber: e.target.value }); setErrors({ ...errors, idNumber: '' }); }}
                  onFocus={() => setFocusedField('idNumber')}
                  onBlur={() => setFocusedField('')}
                  placeholder={t.idNumber}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button type="button" className="btn" onClick={handleSendOtp}>{t.sendOtp}</button>
                {otpSent && !otpVerified && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder={t.otpPlaceholder}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
                    />
                    <button type="button" className="btn" onClick={handleVerifyOtp}>{t.verifyOtp}</button>
                  </div>
                )}

                {otpVerified && <span style={{ color: '#2e8b57', fontWeight: 600 }}>{t.idVerified}</span>}
              </div>

              <small style={{ color: '#666' }}>{t.otpSentInfo}</small>
            </div>
            {errors.idType && <span className="error-text">{errors.idType}</span>}
            {errors.idNumber && <span className="error-text">{errors.idNumber}</span>}
            {errors.idVerification && <span className="error-text">{errors.idVerification}</span>}
          </div>

          {/* Password Field */}
          <div className={`form-group ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'error' : ''}`}>
            <label>🔒 {t.password}</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Confirm Password Field */}
          <div className={`form-group ${focusedField === 'confirmPassword' ? 'focused' : ''} ${errors.confirmPassword ? 'error' : ''}`}>
            <label>🔐 {t.confirmPassword}</label>
            <div className="input-wrapper">
              <span className="input-icon">🔐</span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField('')}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          {/* Register As + Preferences (moved lower for cleaner layout) */}
          <div className={`form-group ${focusedField === 'userType' ? 'focused' : ''}`}>
            <label>🎯 {t.registerAs}</label>
            <div className="selector-row">
              <div className="user-type-selector bottom">
              <button
                type="button"
                className={`type-btn ${formData.userType === 'jobSeeker' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, userType: 'jobSeeker' })}
              >
                <span className="type-icon">👨‍💼</span>
                <span className="type-label">{t.skilledWorker}</span>
              </button>
              <button
                type="button"
                className={`type-btn ${formData.userType === 'jobProvider' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, userType: 'jobProvider' })}
              >
                <span className="type-icon">🏢</span>
                <span className="type-label">{t.jobProvider}</span>
              </button>
              </div>

              {/* preferences removed per request */}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="register-btn">
            <span className="btn-text">🎉 {t.register}</span>
            <span className="btn-icon">→</span>
          </button>

          {/* Login Link */}
          <p className="login-link">
            {t.alreadyHaveAccount} <Link to="/login">🔑 {t.loginHere}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;