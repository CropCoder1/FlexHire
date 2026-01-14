import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('flexhire_jobs')) || [];
    const myJobs = savedJobs.filter(job => job.providerId === user?.id);
    setPostedJobs(myJobs);
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
      status: 'open',
      applicants: []
    };

    const savedJobs = JSON.parse(localStorage.getItem('flexhire_jobs')) || [];
    savedJobs.push(newJob);
    localStorage.setItem('flexhire_jobs', JSON.stringify(savedJobs));
    
    setPostedJobs([...postedJobs, newJob]);
    
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
    const updatedJobs = postedJobs.filter(job => job.id !== jobId);
    setPostedJobs(updatedJobs);
    
    const allJobs = JSON.parse(localStorage.getItem('flexhire_jobs')) || [];
    const filteredJobs = allJobs.filter(job => job.id !== jobId);
    localStorage.setItem('flexhire_jobs', JSON.stringify(filteredJobs));
  };

  return (
    <div className="container">
      <h1>Post a Job</h1>
      <p>Find skilled workers for your needs</p>

      <div className="card">
        <h2>Job Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title:</label>
            <input
              type="text"
              name="title"
              value={jobForm.title}
              onChange={handleChange}
              required
              placeholder="e.g., Need an electrician for wiring"
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={jobForm.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe the work in detail..."
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              value={jobForm.category}
              onChange={handleChange}
              required
            >
              <option value="construction">Construction</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
              <option value="agriculture">Agriculture</option>
              <option value="repair">Repair</option>
              <option value="cleaning">Cleaning</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location (Village/Town):</label>
            <input
              type="text"
              name="location"
              value={jobForm.location}
              onChange={handleChange}
              required
              placeholder="Where is the work located?"
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Duration Type:</label>
              <select
                name="duration"
                value={jobForm.duration}
                onChange={handleChange}
                required
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Duration Value:</label>
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
            <label>Budget (₹):</label>
            <input
              type="number"
              name="budget"
              value={jobForm.budget}
              onChange={handleChange}
              required
              placeholder="Estimated budget"
            />
          </div>

          <div className="form-group">
            <label>Skills Required:</label>
            <input
              type="text"
              name="skillsRequired"
              value={jobForm.skillsRequired}
              onChange={handleChange}
              placeholder="e.g., Welding, Carpentry, Farming"
            />
          </div>

          <div className="form-group">
            <label>Urgency:</label>
            <select
              name="urgency"
              value={jobForm.urgency}
              onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="very-urgent">Very Urgent</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Post Job
          </button>
        </form>
      </div>

      {postedJobs.length > 0 && (
        <div className="card" style={{ marginTop: '30px' }}>
          <h2>Your Posted Jobs</h2>
          <div className="job-list">
            {postedJobs.map(job => (
              <div key={job.id} className="job-card" style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                margin: '10px 0', 
                borderRadius: '5px' 
              }}>
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <span><strong>Location:</strong> {job.location}</span>
                  <span><strong>Budget:</strong> ₹{job.budget}</span>
                  <span><strong>Duration:</strong> {job.durationValue} {job.duration}</span>
                </div>
                <button 
                  onClick={() => handleDeleteJob(job.id)}
                  className="btn" 
                  style={{ 
                    backgroundColor: '#f44336', 
                    color: 'white', 
                    marginTop: '10px' 
                  }}
                >
                  Delete Job
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobProvider;