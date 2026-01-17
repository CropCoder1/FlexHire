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
      <h1>{t.postJob}</h1>
      <p>{t.findSkilledWorkers}</p>

      <div className="card">
        <h2>{t.jobDetails}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.jobTitle}:</label>
            <input
              type="text"
              name="title"
              value={jobForm.title}
              onChange={handleChange}
              required
              placeholder={t.jobTitle}
            />
          </div>

          <div className="form-group">
            <label>{t.description}:</label>
            <textarea
              name="description"
              value={jobForm.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder={t.description}
            />
          </div>

          <div className="form-group">
            <label>{t.category}:</label>
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
            <label>{t.location}:</label>
            <input
              type="text"
              name="location"
              value={jobForm.location}
              onChange={handleChange}
              required
              placeholder={t.location}
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>{t.durationType}:</label>
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

            <div className="form-group" style={{ flex: 1 }}>
              <label>{t.durationValue}:</label>
              <input
                type="number"
                name="durationValue"
                value={jobForm.durationValue}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 2"
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t.budget}:</label>
            <input
              type="number"
              name="budget"
              value={jobForm.budget}
              onChange={handleChange}
              required
              placeholder={t.budget}
            />
          </div>

          <div className="form-group">
            <label>{t.skillsRequired}:</label>
            <input
              type="text"
              name="skillsRequired"
              value={jobForm.skillsRequired}
              onChange={handleChange}
              placeholder={t.skillsRequired}
            />
          </div>

          <div className="form-group">
            <label>{t.urgency}:</label>
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

          <button type="submit" className="btn btn-primary">
            {t.postJob}
          </button>
        </form>
      </div>

      {postedJobs.length > 0 && (
        <div className="card" style={{ marginTop: '30px' }}>
          <h2>{t.yourPostedJobs}</h2>
          <div className="job-list">
            {postedJobs.map(job => {
              const jobApplicants = dataManager.getApplicationsByJobId(job.id);
              const applicantCount = jobApplicants.length;
              
              return (
                <div key={job.id} className="job-card" style={{ 
                  border: '1px solid #ddd', 
                  padding: '15px', 
                  margin: '10px 0', 
                  borderRadius: '5px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3>{job.title}</h3>
                      <p>{job.description}</p>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap' }}>
                        <span><strong>{t.location}:</strong> {job.location}</span>
                        <span><strong>{t.budget}:</strong> ₹{job.budget}</span>
                        <span><strong>{t.durationType}:</strong> {job.durationValue} {job.duration}</span>
                        <span style={{
                          backgroundColor: job.status === 'open' ? '#4CAF50' : 
                                         job.status === 'in-progress' ? '#ff9800' : '#666',
                          color: 'white',
                          padding: '3px 10px',
                          borderRadius: '3px',
                          fontSize: '12px'
                        }}>
                          {job.status === 'open' ? 'Open' : 
                           job.status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span style={{ 
                        backgroundColor: job.urgency === 'urgent' ? '#ff9800' : 
                                       job.urgency === 'very-urgent' ? '#f44336' : '#4CAF50',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        display: 'block',
                        marginBottom: '10px'
                      }}>
                        {job.urgency.toUpperCase()}
                      </span>
                      <div style={{ 
                        backgroundColor: applicantCount > 0 ? '#2196F3' : '#999', 
                        color: 'white', 
                        padding: '5px 10px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        textAlign: 'center',
                        marginBottom: '10px'
                      }}>
                        {applicantCount} {t.applicants}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button 
                      onClick={() => handleViewApplicants(job)}
                      className="btn btn-primary"
                      disabled={applicantCount === 0}
                    >
                      {t.viewApplicants} ({applicantCount})
                    </button>
                    
                    {job.status === 'in-progress' && (
                      <button 
                        onClick={() => handleCompleteJob(job.id)}
                        className="btn"
                        style={{ backgroundColor: '#4CAF50', color: 'white' }}
                      >
                        {t.markAsCompleted}
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleDeleteJob(job.id)}
                      className="btn" 
                      style={{ 
                        backgroundColor: '#f44336', 
                        color: 'white'
                      }}
                    >
                      {t.deleteJob}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Applicant Modal */}
      {selectedJob && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>{t.applicants} for: {selectedJob.title}</h2>
              <button 
                onClick={handleCloseApplicants}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>

            {applicants.length > 0 ? (
              <div>
                <p style={{ marginBottom: '20px' }}>Total {t.applicants}: {applicants.length}</p>
                
                {applicants.map((applicant, index) => {
                  const applicantUser = dataManager.getUserById(applicant.userId);
                  return (
                    <div key={applicant.id} style={{
                      border: '1px solid #ddd',
                      padding: '15px',
                      marginBottom: '15px',
                      borderRadius: '5px',
                      backgroundColor: selectedJob.selectedApplicantId === applicant.userId ? '#e8f5e9' : 'white'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 5px 0' }}>
                            {applicantUser ? applicantUser.name : 'Unknown User'}
                          </h4>
                          <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                            {applicantUser ? applicantUser.email : 'No email'}
                          </p>
                          {applicantUser?.skills && (
                            <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                              <strong>Skills:</strong> {applicantUser.skills}
                            </p>
                          )}
                          <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
                            Applied on: {new Date(applicant.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {selectedJob.status === 'open' && (
                          <button
                            onClick={() => handleSelectApplicant(applicant.userId)}
                            className="btn btn-primary"
                          >
                            {t.selectApplicant}
                          </button>
                        )}
                        
                        {selectedJob.selectedApplicantId === applicant.userId && (
                          <span style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '3px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {t.selected}
                          </span>
                        )}
                      </div>
                      
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                        <button
                          onClick={() => {
                            if (applicantUser) {
                              alert(
                                `Applicant Profile:\n` +
                                `Name: ${applicantUser.name}\n` +
                                `Email: ${applicantUser.email}\n` +
                                `Skills: ${applicantUser.skills || 'Not specified'}\n` +
                                `Location: ${applicantUser.location || 'Not specified'}\n` +
                                `Applied on: ${new Date(applicant.appliedDate).toLocaleDateString()}`
                              );
                            }
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            color: '#2196F3',
                            border: '1px solid #2196F3',
                            padding: '5px 15px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          {t.viewProfile}
                        </button>
                        
                        <button
                          onClick={() => {
                            if (applicantUser) {
                              alert(
                                `Contact Information:\n` +
                                `Name: ${applicantUser.name}\n` +
                                `Email: ${applicantUser.email}\n` +
                                `Phone: ${applicantUser.phone || 'Not provided'}\n\n` +
                                `You can contact them directly at their email address.`
                              );
                            }
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            color: '#4CAF50',
                            border: '1px solid #4CAF50',
                            padding: '5px 15px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            marginLeft: '10px'
                          }}
                        >
                          {t.contact}
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                  <h4>{t.jobStatus}: 
                    <span style={{
                      color: selectedJob.status === 'open' ? '#4CAF50' : 
                            selectedJob.status === 'in-progress' ? '#ff9800' : '#666',
                      marginLeft: '10px'
                    }}>
                      {selectedJob.status === 'open' ? t.open : 
                       selectedJob.status === 'in-progress' ? t.inProgress : t.completed}
                    </span>
                  </h4>
                  
                  {selectedJob.selectedApplicantId && (
                    <p>{t.selected} {t.applicants}: {
                      applicants.find(a => a.userId === selectedJob.selectedApplicantId) ? 
                      dataManager.getUserById(selectedJob.selectedApplicantId)?.name || 'Unknown' : 'Unknown'
                    }</p>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>No {t.applicants.toLowerCase()} yet for this job.</p>
                <p style={{ color: '#666' }}>Share your job posting to get more {t.applicants.toLowerCase()}.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobProvider;