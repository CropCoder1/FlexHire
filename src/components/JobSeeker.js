import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import dataManager from '../utils/dataManager';

const JobSeeker = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    location: '',
    duration: 'all',
    maxBudget: '',
    search: ''
  });
  const { t } = useLanguage();

  useEffect(() => {
    // Load jobs from shared data
    const allJobs = dataManager.getJobs();
    setJobs(allJobs.filter(job => job.status === 'open'));
  }, []);

  const handleApply = (jobId) => {
    // Check if already applied
    const userApplications = dataManager.getApplicationsByUserId(user.id);
    const alreadyApplied = userApplications.some(app => app.jobId === jobId);
    
    if (alreadyApplied) {
      alert('You have already applied for this job!');
      return;
    }

    // Create application in shared data
    const application = {
      id: Date.now(),
      jobId: jobId,
      userId: user.id,
      appliedDate: new Date().toISOString(),
      status: 'pending'
    };

    dataManager.addApplication(application);
    
    // Update local state to reflect application
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        const jobApplications = dataManager.getApplicationsByJobId(jobId);
        return { 
          ...job, 
          applicants: jobApplications 
        };
      }
      return job;
    });

    setJobs(updatedJobs);
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

  // Check if user has applied for a job
  const hasApplied = (jobId) => {
    const userApplications = dataManager.getApplicationsByUserId(user.id);
    return userApplications.some(app => app.jobId === jobId);
  };

  const categories = [
    { value: 'all', label: t.allCategories },
    { value: 'construction', label: t.construction },
    { value: 'electrical', label: t.electrical },
    { value: 'plumbing', label: t.plumbing },
    { value: 'agriculture', label: t.agriculture },
    { value: 'repair', label: t.repair },
    { value: 'cleaning', label: t.cleaning }
  ];

  const durations = [
    { value: 'all', label: t.allDurations },
    { value: 'hourly', label: t.hourly },
    { value: 'daily', label: t.daily },
    { value: 'weekly', label: t.weekly },
    { value: 'monthly', label: t.monthly }
  ];

  return (
    <div className="container">
      <h1>{t.availableJobs}</h1>
      <p>{t.findWorkMatches}</p>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>{t.filterJobs}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div className="form-group">
            <label>{t.category}:</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t.location}:</label>
            <input
              type="text"
              placeholder={t.location}
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>{t.duration}:</label>
            <select
              value={filters.duration}
              onChange={(e) => setFilters({...filters, duration: e.target.value})}
            >
              {durations.map(dur => (
                <option key={dur.value} value={dur.value}>{dur.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t.maxBudget}:</label>
            <input
              type="number"
              placeholder={t.maxBudget}
              value={filters.maxBudget}
              onChange={(e) => setFilters({...filters, maxBudget: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '15px' }}>
          <label>{t.search}:</label>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="jobs-list">
        {filteredJobs.length === 0 ? (
          <div className="card">
            <p style={{ textAlign: 'center' }}>{t.noJobsFound}</p>
          </div>
        ) : (
          filteredJobs.map(job => {
            const jobApplicants = dataManager.getApplicationsByJobId(job.id);
            const hasUserApplied = hasApplied(job.id);
            
            return (
              <div key={job.id} className="card" style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3>{job.title}</h3>
                    <p style={{ color: '#666', marginBottom: '10px' }}>{t.postedBy}: {job.providerName}</p>
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
                    <span style={{ marginRight: '20px' }}><strong>{t.location}:</strong> {job.location}</span>
                    <span style={{ marginRight: '20px' }}><strong>{t.category}:</strong> {job.category}</span>
                    <span style={{ marginRight: '20px' }}><strong>{t.durationType}:</strong> {job.durationValue} {job.duration}</span>
                    <span><strong>{t.skillsRequired}:</strong> {job.skillsRequired}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ color: '#4CAF50' }}>₹{job.budget}</h3>
                    <button 
                      onClick={() => handleApply(job.id)}
                      className="btn btn-primary"
                      disabled={hasUserApplied}
                    >
                      {hasUserApplied ? t.applied : t.applyNow}
                    </button>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                      {jobApplicants.length} {t.applicants.toLowerCase()} so far
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobSeeker;