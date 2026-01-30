import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    rating: 0,
    earnings: 0
  });
  const { t } = useLanguage();

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('flexhire_jobs')) || [];
    if (user?.userType === 'jobSeeker') {
      const appliedJobs = savedJobs.filter(job => 
        job.applicants?.some(app => app.id === user.id)
      );
      setStats({
        totalJobs: appliedJobs.length,
        completedJobs: appliedJobs.filter(j => j.status === 'completed').length,
        rating: user.rating || 0,
        earnings: appliedJobs
          .filter(j => j.status === 'completed')
          .reduce((sum, job) => sum + parseInt(job.budget || 0), 0)
      });
    } else if (user?.userType === 'jobProvider') {
      const myJobs = savedJobs.filter(job => job.providerId === user.id);
      setStats({
        totalJobs: myJobs.length,
        completedJobs: myJobs.filter(j => j.status === 'completed').length,
        rating: 0,
        earnings: 0
      });
    }
  }, [user]);

  return (
    <div className="container">
      <div style={{ marginBottom: '40px' }}>
        <h1>👋 {t.welcomeBack}, <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name}!</span></h1>
        <p style={{ color: '#666', marginBottom: '10px', fontSize: '16px' }}>
          {user?.userType === 'jobSeeker' 
            ? t.findNearbyJobs 
            : t.postFindWorkers}
        </p>
      </div>

      <div className="dashboard-cards">
        {/* Quick Actions Card */}
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            ⚡ {t.quickActions}
          </h3>
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {user?.userType === 'jobSeeker' ? (
              <>
                <Link to="/job-seeker" className="btn btn-primary">
                  🔍 {t.browseJobs}
                </Link>
                <Link to="/profile" className="btn btn-secondary">
                  👤 {t.updateProfile}
                </Link>
              </>
            ) : (
              <>
                <Link to="/job-provider" className="btn btn-primary">
                  ➕ {t.postJobs}
                </Link>
                <Link to="/job-seeker" className="btn btn-secondary">
                  👥 {t.viewWorkers}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="card">
            <h4>📊 {t.jobsPostedApplied}</h4>
            <p className="stat-number">{stats.totalJobs}</p>
            <p style={{ fontSize: '12px', color: '#999', margin: '10px 0 0 0' }}>
              {stats.totalJobs === 1 ? 'job' : 'jobs'}
            </p>
          </div>
          
          <div className="card">
            <h4>✅ {t.jobsCompleted}</h4>
            <p className="stat-number">{stats.completedJobs}</p>
            <p style={{ fontSize: '12px', color: '#999', margin: '10px 0 0 0' }}>
              {stats.completedJobs === 1 ? 'completed' : 'completed'}
            </p>
          </div>
          
          <div className="card">
            <h4>⭐ {t.rating}</h4>
            <p className="stat-number">{stats.rating}/5</p>
            <p style={{ fontSize: '12px', color: '#999', margin: '10px 0 0 0' }}>
              {stats.rating > 0 ? 'Great work!' : 'Getting started'}
            </p>
          </div>
          
          {user?.userType === 'jobSeeker' && (
            <div className="card">
              <h4>💰 {t.totalEarnings}</h4>
              <p className="stat-number">₹{stats.earnings}</p>
              <p style={{ fontSize: '12px', color: '#999', margin: '10px 0 0 0' }}>
                Total earned
              </p>
            </div>
          )}
        </div>

        {/* Recent Activity Card */}
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            📅 {t.recentActivity}
          </h3>
          <div style={{ marginTop: '15px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', textAlign: 'center' }}>
            <p style={{ color: '#999', margin: '0' }}>
              🚀 {t.noActivity} {user?.userType === 'jobSeeker' ? t.applyingJobs : t.postingJob}!
            </p>
            <p style={{ fontSize: '13px', color: '#bbb', margin: '8px 0 0 0' }}>
              {user?.userType === 'jobSeeker' 
                ? 'Start exploring jobs to boost your earnings' 
                : 'Post your first job to find skilled workers'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;