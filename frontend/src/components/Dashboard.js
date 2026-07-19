import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LiveTime from './LiveTime';
import dataManager from '../utils/dataManager';

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
        rating: user.rating || 0,
        earnings: 0
      });
    }
  }, [user]);

  return (
    <div className="container">
      <LiveTime />

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '5px' }}>
          Welcome to <span style={{ 
            color: 'var(--color-accent_primary)',
            fontWeight: '900',
            letterSpacing: '1px',
          }}>FLEXHIRE</span>
        </h1>
        <p style={{ 
          color: 'var(--color-text_secondary)', 
          marginBottom: '5px', 
          fontSize: '16px' 
        }}>
          {user?.userType === 'jobSeeker' 
            ? t.findNearbyJobs 
            : t.postFindWorkers}
        </p>
        <p style={{
          color: 'var(--color-text_secondary)',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '0',
        }}>
          Connect Skills. Solve Needs. Instantly.
        </p>
        <hr style={{ borderColor: 'var(--color-border)', margin: '15px 0', opacity: 0.5 }} />
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

        {/* Stats Grid - Simple and Clean */}
        <div className="stats-grid">
          <div className="card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '15px'
            }}>
              <div>
                <h4 style={{ marginTop: '0', marginBottom: '5px', color: 'var(--color-text_primary)' }}>
                  📊 {t.jobsPostedApplied}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text_secondary)', margin: '0' }}>
                  {stats.totalJobs} {stats.totalJobs === 1 ? 'job' : 'jobs'}
                </p>
              </div>
              <p style={{ 
                fontSize: '36px', 
                fontWeight: '700', 
                color: 'var(--color-accent_primary)', 
                margin: '0',
                minWidth: '50px',
                textAlign: 'right'
              }}>
                {stats.totalJobs}
              </p>
            </div>
          </div>
          
          <div className="card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '15px'
            }}>
              <div>
                <h4 style={{ marginTop: '0', marginBottom: '5px', color: 'var(--color-text_primary)' }}>
                  ✅ {t.jobsCompleted}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text_secondary)', margin: '0' }}>
                  {stats.completedJobs} completed
                </p>
              </div>
              <p style={{ 
                fontSize: '36px', 
                fontWeight: '700', 
                color: 'var(--color-accent_primary)', 
                margin: '0',
                minWidth: '50px',
                textAlign: 'right'
              }}>
                {stats.completedJobs}
              </p>
            </div>
          </div>
          
          <div className="card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '15px'
            }}>
              <div>
                <h4 style={{ marginTop: '0', marginBottom: '5px', color: 'var(--color-text_primary)' }}>
                  ⭐ {t.rating}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text_secondary)', margin: '0' }}>
                  {stats.rating > 0 ? 'Great work!' : 'Getting started'}
                </p>
              </div>
              <p style={{ 
                fontSize: '36px', 
                fontWeight: '700', 
                color: 'var(--color-accent_primary)', 
                margin: '0',
                minWidth: '50px',
                textAlign: 'right'
              }}>
                {stats.rating}
              </p>
            </div>
          </div>
          
          {user?.userType === 'jobSeeker' && (
            <div className="card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '15px'
              }}>
                <div>
                  <h4 style={{ marginTop: '0', marginBottom: '5px', color: 'var(--color-text_primary)' }}>
                    💰 {t.totalEarnings}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text_secondary)', margin: '0' }}>
                    Total earned
                  </p>
                </div>
                <p style={{ 
                  fontSize: '36px', 
                  fontWeight: '700', 
                  color: 'var(--color-accent_primary)', 
                  margin: '0',
                  minWidth: '60px',
                  textAlign: 'right'
                }}>
                  ₹{stats.earnings}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity Card */}
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0' }}>
            📅 {t.recentActivity}
          </h3>
          <div style={{ 
            marginTop: '15px', 
            padding: '20px', 
            backgroundColor: 'var(--color-bg_secondary)', 
            borderRadius: '10px', 
            textAlign: 'center',
            border: '1px solid var(--color-border)'
          }}>
            <p style={{ color: 'var(--color-text_secondary)', margin: '0', fontWeight: '500' }}>
              🚀 {t.noActivity} {user?.userType === 'jobSeeker' ? t.applyingJobs : t.postingJob}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text_tertiary)', margin: '8px 0 0 0' }}>
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