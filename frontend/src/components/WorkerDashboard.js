import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LiveTime from './LiveTime';
import { getWorkerDashboard } from '../utils/api';

const WorkerDashboard = ({ user }) => {
  const [stats, setStats] = useState({ activeJobs: 0, completedJobs: 0, rating: 0, earnings: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await getWorkerDashboard(user?.id);
        if (result.success) {
          setStats(result.data.stats);
          setRecentApplications(result.data.recentApplications || []);
        }
      } catch (e) { console.error('Failed to load dashboard:', e); }
      finally { setLoading(false); }
    };
    if (user?.id) loadDashboard();
  }, [user]);

  if (loading) return <div className="container"><p>Loading dashboard...</p></div>;

  return (
    <div className="container">
      <LiveTime />
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '5px' }}>
          Welcome, <span style={{ color: 'var(--color-accent_primary)', fontWeight: '900', letterSpacing: '1px' }}>{user?.name}</span>! 👋
        </h1>
        <p style={{ color: 'var(--color-text_secondary)', marginBottom: '0', fontSize: '16px' }}>Ready to earn? Browse jobs and apply today!</p>
      </div>

      <div className="dashboard-cards">
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--color-accent_primary) 0.5%, var(--color-bg_secondary) 100%)', borderLeft: '4px solid var(--color-accent_primary)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0', color: 'var(--color-text_primary)' }}>⚡ Quick Actions</h3>
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/job-seeker" className="btn btn-primary">🔍 Browse Jobs</Link>
            <Link to="/profile" className="btn btn-secondary">👤 Update Profile</Link>
            <Link to="/blog" className="btn btn-secondary">📝 View Blog</Link>
          </div>
        </div>

        <div className="stats-grid">
          {[
            { icon: '💼', label: 'Active Jobs', sub: 'In progress', value: stats.activeJobs },
            { icon: '✅', label: 'Completed', sub: 'Jobs finished', value: stats.completedJobs },
            { icon: '⭐', label: 'Your Rating', sub: stats.rating > 0 ? 'Excellent!' : 'Build it', value: stats.rating },
            { icon: '💰', label: 'Total Earnings', sub: 'Earned so far', value: `₹${stats.earnings}` }
          ].map((s, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
                <div>
                  <h4 style={{ marginTop: '0', marginBottom: '5px', color: 'var(--color-text_primary)' }}>{s.icon} {s.label}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text_secondary)', margin: '0' }}>{s.sub}</p>
                </div>
                <p style={{ fontSize: '36px', fontWeight: '700', color: 'var(--color-accent_primary)', margin: '0' }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {recentApplications.length > 0 && (
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0' }}>📋 Recent Applications</h3>
            <div style={{ marginTop: '15px' }}>
              {recentApplications.map((app, idx) => (
                <div key={app.id} style={{ padding: '12px', backgroundColor: 'var(--color-bg_secondary)', borderRadius: '8px', marginBottom: idx < recentApplications.length - 1 ? '10px' : '0', borderLeft: '4px solid var(--color-accent_primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: '0 0 3px 0', fontWeight: '600', color: 'var(--color-text_primary)' }}>{app.job_title || `Application #${app.id}`}</p>
                    <p style={{ margin: '0', fontSize: '12px', color: 'var(--color-text_secondary)' }}>Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>
                  <span style={{ backgroundColor: app.status === 'pending' ? 'var(--color-warning)' : 'var(--color-success)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize' }}>{app.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card" style={{ background: 'var(--color-bg_secondary)', borderLeft: '4px solid var(--color-accent_secondary)', padding: '20px' }}>
          <h3 style={{ marginTop: '0', color: 'var(--color-accent_secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>💡 Quick Tips</h3>
          <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8', color: 'var(--color-text_primary)' }}>
            <li>Complete your profile to attract more jobs</li>
            <li>Respond quickly to job offers</li>
            <li>Maintain high quality work for better ratings</li>
            <li>Share your portfolio in the Blog section</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
