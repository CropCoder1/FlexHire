import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    rating: 0,
    earnings: 0
  });

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
      <h1>Welcome to FlexHire, {user?.name}!</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        {user?.userType === 'jobSeeker' 
          ? 'Find nearby jobs based on your skills' 
          : 'Post jobs and find skilled workers'}
      </p>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Quick Actions</h3>
          <div style={{ marginTop: '20px' }}>
            {user?.userType === 'jobSeeker' ? (
              <>
                <Link to="/job-seeker" className="btn btn-primary" style={{ marginRight: '10px' }}>
                  Browse Jobs
                </Link>
                <Link to="/profile" className="btn btn-secondary">
                  Update Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/job-provider" className="btn btn-primary" style={{ marginRight: '10px' }}>
                  Post New Job
                </Link>
                <Link to="/job-seeker" className="btn btn-secondary">
                  View Workers
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="stats-grid">
          <div className="card">
            <h4>Jobs Posted/Applied</h4>
            <p className="stat-number">{stats.totalJobs}</p>
          </div>
          
          <div className="card">
            <h4>Jobs Completed</h4>
            <p className="stat-number">{stats.completedJobs}</p>
          </div>
          
          <div className="card">
            <h4>Rating</h4>
            <p className="stat-number">{stats.rating}/5</p>
          </div>
          
          {user?.userType === 'jobSeeker' && (
            <div className="card">
              <h4>Total Earnings</h4>
              <p className="stat-number">₹{stats.earnings}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Recent Activity</h3>
          <div style={{ marginTop: '15px' }}>
            <p>No recent activity. Start by {user?.userType === 'jobSeeker' ? 'applying for jobs' : 'posting a job'}!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;