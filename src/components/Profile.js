import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Profile = ({ user, updateProfile }) => {
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: user?.location || 'Rural Area',
    skills: '',
    experience: '',
    bio: ''
  });
  const { t } = useLanguage();

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem(`flexhire_profile_${user?.id}`));
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to local storage
    localStorage.setItem(`flexhire_profile_${user?.id}`, JSON.stringify(profile));
    
    // Update shared data through App.js
    if (updateProfile) {
      updateProfile(profile);
    }
    
    alert('Profile updated successfully!');
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{profile.name}</h1>
          <p>{user?.userType === 'jobSeeker' ? t.skilledWorkerTitle : t.jobProvider}</p>
          <p>📍 {profile.location}</p>
        </div>
      </div>

      <div className="card">
        <h2>{t.editProfile}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.fullName}:</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.email}:</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.phoneNumber}:</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.location}:</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              required
            />
          </div>

          {user?.userType === 'jobSeeker' && (
            <>
              <div className="form-group">
                <label>{t.skills}:</label>
                <input
                  type="text"
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  placeholder={t.skills}
                />
              </div>

              <div className="form-group">
                <label>{t.experienceYears}:</label>
                <input
                  type="number"
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>{t.bio}:</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="3"
              placeholder={t.bioPlaceholder}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            {t.saveChanges}
          </button>
        </form>
      </div>

      {user?.userType === 'jobSeeker' && profile.skills && (
        <div className="card">
          <h3>{t.yourSkills}</h3>
          <div className="skills-tags">
            {profile.skills.split(',').map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;