import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import dataManager from '../utils/dataManager';

const JobProvider = ({ user }) => {
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    category: 'construction',
    location: '',
    duration: 'hourly',
    durationValue: 1,
    budget: '',
    skillsRequired: '',
    urgency: 'normal'
  });

  const [postedJobs, setPostedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    // Load posted jobs from shared data
    const providerJobs = dataManager.getJobsByProviderId(user?.id);
    setPostedJobs(providerJobs);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newJob = {
      id: Date.now(),
      ...jobForm,
      providerId: user.id,
      providerName: user.name,
      providerEmail: user.email,
      postedDate: new Date().toISOString(),
      status: 'open'
    };

    // Save to shared data
    dataManager.addJob(newJob);
    
    // Update local state
    setPostedJobs([...postedJobs, newJob]);
    
    // Reset form
    setJobForm({
      title: '',
      description: '',
      category: 'construction',
      location: '',
      duration: 'hourly',
      durationValue: 1,
      budget: '',
      skillsRequired: '',
      urgency: 'normal'
    });

    alert('Job posted successfully!');
  };

  const handleChange = (e) => {
    setJobForm({
      ...jobForm,
      [e.target.name]: e.target.value
    });
  };

  const handleDeleteJob = (jobId) => {
    // Delete from shared data
    dataManager.deleteJob(jobId);
    
    // Update local state
    const updatedJobs = postedJobs.filter(job => job.id !== jobId);
    setPostedJobs(updatedJobs);
    
    if (selectedJob?.id === jobId) {
      setSelectedJob(null);
      setApplicants([]);
    }
  };

  const handleViewApplicants = (job) => {
    setSelectedJob(job);
    // Get applicants from shared data
    const jobApplications = dataManager.getApplicationsByJobId(job.id);
    setApplicants(jobApplications);
  };

  const handleCloseApplicants = () => {
    setSelectedJob(null);
    setApplicants([]);
  };

  const handleSelectApplicant = (applicantId) => {
    // Update job status in shared data
    dataManager.updateJob(selectedJob.id, {
      status: 'in-progress',
      selectedApplicantId: applicantId
    });
    
    // Update local state
    const updatedJobs = postedJobs.map(job => {
      if (job.id === selectedJob.id) {
        return { 
          ...job, 
          status: 'in-progress',
          selectedApplicantId: applicantId
        };
      }
      return job;
    });
    
    setPostedJobs(updatedJobs);
    setSelectedJob(updatedJobs.find(job => job.id === selectedJob.id));
    
    alert('Applicant selected! Job status updated to In Progress.');
  };

  const handleCompleteJob = (jobId) => {
    // Update job status in shared data
    dataManager.updateJob(jobId, { status: 'completed' });
    
    // Update local state
    const updatedJobs = postedJobs.map(job => {
      if (job.id === jobId) {
        return { ...job, status: 'completed' };
      }
      return job;
    });
    
    setPostedJobs(updatedJobs);
    
    if (selectedJob?.id === jobId) {
      setSelectedJob(updatedJobs.find(job => job.id === jobId));
    }
    
    alert('Job marked as completed!');
  };

  const categories = [
    { value: 'construction', label: t.construction },
    { value: 'electrical', label: t.electrical },
    { value: 'plumbing', label: t.plumbing },
    { value: 'agriculture', label: t.agriculture },
    { value: 'repair', label: t.repair },
    { value: 'cleaning', label: t.cleaning },
    { value: 'other', label: t.other }
  ];

  const durations = [
    { value: 'hourly', label: t.hourly },
    { value: 'daily', label: t.daily },
    { value: 'weekly', label: t.weekly },
    { value: 'monthly', label: t.monthly }
  ];

  const urgencies = [
    { value: 'normal', label: t.normal },
    { value: 'urgent', label: t.urgent },
    { value: 'very-urgent', label: t.veryUrgent }
  ];

  return (
    <div className="container">
      <h1>➕ {t.postJob}</h1>
      <p>👥 {t.findSkilledWorkers}</p>

      {/* Post Job Form */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          📋 {t.jobDetails}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>✏️ {t.jobTitle}</label>
            <input
              type="text"
              name="title"
              value={jobForm.title}
              onChange={handleChange}
              required
              placeholder="e.g., Carpenter needed for home renovation"
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>📝 {t.description}</label>
            <textarea
              name="description"
              value={jobForm.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe the job details..."
              style={{
                padding: '12px 15px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontFamily: 'inherit',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                backgroundColor: '#f9f9f9',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="form-group">
            <label>📂 {t.category}</label>
            <select
              name="category"
              value={jobForm.category}
              onChange={handleChange}
              required
            >
              <option value="">{t.selectCategory}</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>📍 {t.location}</label>
            <input
              type="text"
              name="location"
              value={jobForm.location}
              onChange={handleChange}
              required
              placeholder="City, Area"
            />
          </div>

          <div className="form-group">
            <label>⏱️ {t.durationType}</label>
            <select
              name="duration"
              value={jobForm.duration}
              onChange={handleChange}
              required
            >
              {durations.map(dur => (
                <option key={dur.value} value={dur.value}>{dur.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>🔢 {t.durationValue}</label>
            <input
              type="number"
              name="durationValue"
              value={jobForm.durationValue}
              onChange={handleChange}
              required
              min="1"
              placeholder="2"
            />
          </div>

          <div className="form-group">
            <label>💰 {t.budget}</label>
            <input
              type="number"
              name="budget"
              value={jobForm.budget}
              onChange={handleChange}
              required
              placeholder="Enter amount in rupees"
            />
          </div>

          <div className="form-group">
            <label>🚨 {t.urgency}</label>
            <select
              name="urgency"
              value={jobForm.urgency}
              onChange={handleChange}
            >
              {urgencies.map(urg => (
                <option key={urg.value} value={urg.value}>{urg.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>🎯 {t.skillsRequired}</label>
            <input
              type="text"
              name="skillsRequired"
              value={jobForm.skillsRequired}
              onChange={handleChange}
              placeholder="e.g., Carpentry, Electrical, Plumbing"
            />
          </div>

          <button type="submit" className="register-btn" style={{ gridColumn: '1 / -1' }}>
            <span className="btn-text">🚀 {t.postJob}</span>
            <span className="btn-icon">→</span>
          </button>
        </form>
      </div>

      {/* Your Posted Jobs */}
      {postedJobs.length > 0 && (
        <div className="card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            📌 {t.yourPostedJobs}
          </h2>
          <div className="jobs-list">
            {postedJobs.map(job => {
              const jobApplicants = dataManager.getApplicationsByJobId(job.id);
              const applicantCount = jobApplicants.length;
              
              return (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <div style={{ flex: 1 }}>
                      <h3>{job.title}</h3>
                      <p style={{ color: '#666', margin: '8px 0' }}>{job.description}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`urgency-badge ${job.urgency || 'normal'}`}>
                        {job.urgency?.toUpperCase() || 'NORMAL'}
                      </span>
                    </div>
                  </div>

                  <div className="job-details">
                    <div className="detail-item">
                      <strong>📍 {t.location}</strong>
                      <span>{job.location}</span>
                    </div>
                    <div className="detail-item">
                      <strong>🏷️ {t.category}</strong>
                      <span>{job.category}</span>
                    </div>
                    <div className="detail-item">
                      <strong>⏱️ {t.durationType}</strong>
                      <span>{job.durationValue} {job.duration}</span>
                    </div>
                    <div className="detail-item">
                      <strong>📊 {t.jobStatus}</strong>
                      <span style={{
                        backgroundColor: job.status === 'open' ? '#667eea' : 
                                       job.status === 'in-progress' ? '#ffb74d' : '#999',
                        color: 'white',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        display: 'inline-block',
                        fontWeight: '600'
                      }}>
                        {job.status === 'open' ? '🟢 Open' : 
                         job.status === 'in-progress' ? '🟡 In Progress' : '⚫ Completed'}
                      </span>
                    </div>
                  </div>

                  <div className="job-footer">
                    <div className="job-provider">
                      <strong style={{ color: '#999' }}>{t.budget}</strong>
                      <span style={{ fontSize: '20px', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ₹{job.budget}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ 
                        backgroundColor: applicantCount > 0 ? '#667eea' : '#ddd', 
                        color: applicantCount > 0 ? 'white' : '#999',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        textAlign: 'center',
                        minWidth: '80px'
                      }}>
                        {applicantCount} 👤
                      </div>
                      <button 
                        onClick={() => handleViewApplicants(job)}
                        className="btn btn-primary"
                        disabled={applicantCount === 0}
                        style={{ opacity: applicantCount === 0 ? 0.5 : 1 }}
                      >
                        👥 {t.viewApplicants}
                      </button>
                      
                      {job.status === 'in-progress' && (
                        <button 
                          onClick={() => handleCompleteJob(job.id)}
                          className="btn btn-secondary"
                        >
                          ✅ {t.markAsCompleted}
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDeleteJob(job.id)}
                        className="btn btn-danger"
                      >
                        🗑️ {t.deleteJob}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Applicant Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={handleCloseApplicants}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseApplicants}>✕</button>
            
            <h2 style={{ marginTop: '0', marginBottom: '10px' }}>
              👥 {t.applicants} for: <span style={{ color: '#667eea' }}>{selectedJob.title}</span>
            </h2>
            <p style={{ color: '#999', marginBottom: '25px' }}>
              Total applicants: <strong>{applicants.length}</strong>
            </p>

            {applicants.length > 0 ? (
              <div>
                {applicants.map((applicant) => {
                  const applicantUser = dataManager.getUserById(applicant.userId);
                  const isSelected = selectedJob.selectedApplicantId === applicant.userId;
                  
                  return (
                    <div key={applicant.id} className="applicant-card" style={{
                      backgroundColor: isSelected ? '#f0f3ff' : '#f9f9f9',
                      borderLeft: isSelected ? '4px solid #667eea' : '4px solid #ddd'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div className="applicant-name">
                          {isSelected && '⭐ '} {applicantUser ? applicantUser.name : 'Unknown User'}
                        </div>
                        <div className="applicant-detail">
                          📧 {applicantUser ? applicantUser.email : 'No email'}
                        </div>
                        {applicantUser?.skills && (
                          <div className="applicant-detail">
                            🔧 <strong>Skills:</strong> {applicantUser.skills}
                          </div>
                        )}
                        <div className="applicant-detail" style={{ fontSize: '12px', marginTop: '5px' }}>
                          📅 Applied on {new Date(applicant.appliedDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                        {selectedJob.status === 'open' && (
                          <button
                            onClick={() => handleSelectApplicant(applicant.userId)}
                            className={`btn ${isSelected ? 'btn-secondary' : 'btn-primary'}`}
                            style={{ fontSize: '12px', padding: '8px 12px' }}
                          >
                            {isSelected ? '✅ Selected' : '➕ Select'}
                          </button>
                        )}
                        
                        {isSelected && (
                          <span style={{
                            backgroundColor: '#667eea',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '700',
                            textAlign: 'center'
                          }}>
                            ⭐ {t.selected}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                <div style={{ marginTop: '30px', paddingTop: '25px', borderTop: '2px solid #eee' }}>
                  <h4 style={{ marginBottom: '15px' }}>
                    📊 Job Status: 
                    <span style={{
                      color: selectedJob.status === 'open' ? '#667eea' : 
                            selectedJob.status === 'in-progress' ? '#ffb74d' : '#999',
                      marginLeft: '10px',
                      fontWeight: '700'
                    }}>
                      {selectedJob.status === 'open' ? '🟢 Open' : 
                       selectedJob.status === 'in-progress' ? '🟡 In Progress' : '⚫ Completed'}
                    </span>
                  </h4>
                  
                  {selectedJob.selectedApplicantId && (
                    <p style={{ color: '#667eea', fontWeight: '600' }}>
                      ⭐ Selected applicant: {
                        applicants.find(a => a.userId === selectedJob.selectedApplicantId) ? 
                        dataManager.getUserById(selectedJob.selectedApplicantId)?.name || 'Unknown' : 'Unknown'
                      }
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ fontSize: '18px', color: '#999', margin: '0' }}>
                  😔 No applicants yet
                </p>
                <p style={{ fontSize: '14px', color: '#bbb', margin: '10px 0 0 0' }}>
                  Share your job posting to get more applicants
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobProvider;