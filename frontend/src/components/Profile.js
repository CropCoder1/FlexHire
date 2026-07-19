import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getUserProfile, updateUserProfile } from '../utils/api';

const Profile = ({ user, updateProfile }) => {
  const [profile, setProfile] = useState({
    name: user?.name || '', email: user?.email || '', phone: '',
    location: user?.location || '', skills: '', experience: '', bio: ''
  });
  const [focusedField, setFocusedField] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const result = await getUserProfile(user.id);
        if (result.success) {
          const d = result.data;
          setProfile({
            name: d.name || '', email: d.email || '', phone: d.phone || '',
            location: d.location || '', skills: d.skills || '',
            experience: d.experience || '', bio: d.bio || ''
          });
        }
      } catch (e) { console.error('Failed to load profile:', e); }
    };
    loadProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateUserProfile(user.id, profile);
      if (result.success) {
        if (updateProfile) updateProfile(profile);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save profile: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to save profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">{profile.name.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <h1>✏️ {profile.name}</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {(user?.userType === 'jobSeeker' || user?.user_type === 'jobSeeker') ? '👨‍💼' : '🏢'} {(user?.userType === 'jobSeeker' || user?.user_type === 'jobSeeker') ? t.skilledWorkerTitle : t.jobProvider}
          </p>
          <p>📍 {profile.location}</p>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>🕐 Member since {new Date().getFullYear()}</p>
        </div>
      </div>

      {saveSuccess && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '12px 20px', borderRadius: '10px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #c3e6cb' }}>
          ✅ Profile updated successfully!
        </div>
      )}

      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>✏️ {t.editProfile}</h2>
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${focusedField === 'name' ? 'focused' : ''}`}>
            <label>👤 {t.fullName}</label>
            <div className="input-wrapper"><span className="input-icon">👤</span>
              <input type="text" name="name" value={profile.name} onChange={handleChange} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField('')} required />
            </div>
          </div>
          <div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}>
            <label>✉️ {t.email}</label>
            <div className="input-wrapper"><span className="input-icon">✉️</span>
              <input type="email" name="email" value={profile.email} onChange={handleChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} required disabled />
            </div>
          </div>
          <div className={`form-group ${focusedField === 'phone' ? 'focused' : ''}`}>
            <label>📱 {t.phoneNumber}</label>
            <div className="input-wrapper"><span className="input-icon">📱</span>
              <input type="tel" name="phone" value={profile.phone} onChange={handleChange} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField('')} required />
            </div>
          </div>
          <div className={`form-group ${focusedField === 'location' ? 'focused' : ''}`}>
            <label>📍 {t.location}</label>
            <div className="input-wrapper"><span className="input-icon">📍</span>
              <input type="text" name="location" value={profile.location} onChange={handleChange} onFocus={() => setFocusedField('location')} onBlur={() => setFocusedField('')} required />
            </div>
          </div>
          {(user?.userType === 'jobSeeker' || user?.user_type === 'jobSeeker') && (
            <>
              <div className={`form-group ${focusedField === 'skills' ? 'focused' : ''}`}>
                <label>🔧 {t.skills}</label>
                <div className="input-wrapper"><span className="input-icon">🔧</span>
                  <input type="text" name="skills" value={profile.skills} onChange={handleChange} onFocus={() => setFocusedField('skills')} onBlur={() => setFocusedField('')} placeholder="Electrician, Plumber, Carpenter" />
                </div>
              </div>
              <div className={`form-group ${focusedField === 'experience' ? 'focused' : ''}`}>
                <label>📊 {t.experienceYears}</label>
                <div className="input-wrapper"><span className="input-icon">📊</span>
                  <input type="number" name="experience" value={profile.experience} onChange={handleChange} onFocus={() => setFocusedField('experience')} onBlur={() => setFocusedField('')} min="0" max="50" />
                </div>
              </div>
            </>
          )}
          <div className={`form-group ${focusedField === 'bio' ? 'focused' : ''}`}>
            <label>📝 {t.bio}</label>
            <textarea name="bio" value={profile.bio} onChange={handleChange} rows="4" placeholder="Tell us about yourself..."
              style={{ padding: '12px 15px', border: '2px solid #e0e0e0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', transition: 'all 0.3s ease', backgroundColor: '#f9f9f9', resize: 'vertical' }}
              onFocus={(e) => { setFocusedField('bio'); e.target.style.borderColor = '#667eea'; e.target.style.backgroundColor = 'white'; }}
              onBlur={(e) => { setFocusedField(''); e.target.style.borderColor = '#e0e0e0'; e.target.style.backgroundColor = '#f9f9f9'; }}
            />
          </div>
          <button type="submit" className="register-btn" disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
            <span className="btn-text">{loading ? '⏳ Saving...' : `💾 ${t.saveChanges}`}</span>
            <span className="btn-icon">→</span>
          </button>
        </form>
      </div>

      {(user?.userType === 'jobSeeker' || user?.user_type === 'jobSeeker') && profile.skills && (
        <div className="card" style={{ marginTop: '25px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>🎯 {t.yourSkills}</h3>
          <div className="skills-tags">
            {profile.skills.split(',').map((skill, index) => (
              <span key={index} className="skill-tag">{skill.trim()}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;