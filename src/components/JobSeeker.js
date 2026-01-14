import React, { useState, useEffect } from 'react';

const JobSeeker = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    location: '',
    duration: 'all',
    maxBudget: '',
    search: ''
  });

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('flexhire_jobs')) || [];
    setJobs(savedJobs.filter(job => job.status === 'open'));
  }, []);

  const handleApply = (jobId) => {
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        const applicants = job.applicants || [];
        if (!applicants.some(app => app.id === user.id)) {
          applicants.push({
            id: user.id,
            name: user.name,
            email: user.email,
            appliedDate: new Date().toISOString()
          });
        }
        return { ...job, applicants };
      }
      return job;
    });

    setJobs(updatedJobs);
    
    const allJobs = JSON.parse(localStorage.getItem('flexhire_jobs')) || [];
    const updatedAllJobs = allJobs.map(job => {
      if (job.id === jobId) {
        const applicants = job.applicants || [];
        if (!applicants.some(app => app.id === user.id)) {
          applicants.push({
            id: user.id,
            name: user.name,
            email: user.email,
            appliedDate: new Date().toISOString()
          });
        }
        return { ...job, applicants };
      }
      return job;
    });
    
    localStorage.setItem('flexhire_jobs', JSON.stringify(updatedAllJobs));
    alert('Applied successfully!');
  };

  const filteredJobs = jobs.filter(job => {
    if (filters.category !== 'all' && job.category !== filters.category) return false;
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.duration !== 'all' && job.duration !== filters.duration) return false;
    if (filters.maxBudget && parseInt(job.budget) > parseInt(filters.maxBudget)) return false;
    if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container">
      <h1>Available Jobs</h1>
      <p>Find work that matches your skills</p>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Filter Jobs</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div className="form-group">
            <label>Category:</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="all">All Categories</option>
              <option value="construction">Construction</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
              <option value="agriculture">Agriculture</option>
              <option value="repair">Repair</option>
              <option value="cleaning">Cleaning</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              placeholder="Enter location"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Duration:</label>
            <select
              value={filters.duration}
              onChange={(e) => setFilters({...filters, duration: e.target.value})}
            >
              <option value="all">All Durations</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Budget (₹):</label>
            <input
              type="number"
              placeholder="Max budget"
              value={filters.maxBudget}
              onChange={(e) => setFilters({...filters, maxBudget: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '15px' }}>
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by job title..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="jobs-list">
        {filteredJobs.length === 0 ? (
          <div className="card">
            <p style={{ textAlign: 'center' }}>No jobs found matching your criteria</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} className="card" style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3>{job.title}</h3>
                  <p style={{ color: '#666', marginBottom: '10px' }}>Posted by: {job.providerName}</p>
                  <p>{job.description}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    backgroundColor: job.urgency === 'urgent' ? '#ff9800' : 
                                   job.urgency === 'very-urgent' ? '#f44336' : '#4CAF50',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    marginBottom: '10px'
                  }}>
                    {job.urgency.toUpperCase()}
                  </div>
                  <div style={{ color: '#FFD700', fontSize: '20px' }}>
                    {'★'.repeat(4)}☆
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid #eee'
              }}>
                <div>
                  <span style={{ marginRight: '20px' }}><strong>Location:</strong> {job.location}</span>
                  <span style={{ marginRight: '20px' }}><strong>Category:</strong> {job.category}</span>
                  <span style={{ marginRight: '20px' }}><strong>Duration:</strong> {job.durationValue} {job.duration}</span>
                  <span><strong>Skills:</strong> {job.skillsRequired}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ color: '#4CAF50' }}>₹{job.budget}</h3>
                  <button 
                    onClick={() => handleApply(job.id)}
                    className="btn btn-primary"
                    disabled={job.applicants?.some(app => app.id === user.id)}
                  >
                    {job.applicants?.some(app => app.id === user.id) ? 'Applied ✓' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobSeeker;