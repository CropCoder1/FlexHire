import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { createJob, getProviderJobs, updateJob, deleteJob, getJobApplications, submitRating } from '../utils/api';

const JobProvider = ({ user }) => {
  const [jobForm, setJobForm] = useState({ title: '', description: '', category: 'construction', location: '', duration: 'hourly', durationValue: 1, budget: '', skillsRequired: '', urgency: 'normal' });
  const [postedJobs, setPostedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingData, setRatingData] = useState({ jobId: '', workerId: '', workerName: '', rating: 5, review: '' });
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const result = await getProviderJobs(user?.id);
        if (result.success) setPostedJobs(result.data);
      } catch (e) { console.error('Failed to load jobs:', e); }
    };
    if (user?.id) loadJobs();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createJob(jobForm);
      if (result.success) {
        setPostedJobs([...postedJobs, result.data]);
        setJobForm({ title: '', description: '', category: 'construction', location: '', duration: 'hourly', durationValue: 1, budget: '', skillsRequired: '', urgency: 'normal' });
        alert('Job posted successfully!');
      } else { alert('Failed to post job: ' + result.error); }
    } catch (e) { alert('Failed to post job: ' + e.message); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => { setJobForm({ ...jobForm, [e.target.name]: e.target.value }); };

  const handleDeleteJob = async (jobId) => {
    try {
      const result = await deleteJob(jobId);
      if (result.success) {
        setPostedJobs(postedJobs.filter(j => j.id !== jobId));
        if (selectedJob?.id === jobId) { setSelectedJob(null); setApplicants([]); }
        alert('Job deleted!');
      }
    } catch (e) { alert('Failed to delete: ' + e.message); }
  };

  const handleViewApplicants = async (job) => {
    setSelectedJob(job);
    try {
      const result = await getJobApplications(job.id);
      if (result.success) setApplicants(result.data);
    } catch (e) { console.error('Failed to load applicants:', e); }
  };

  const handleSelectApplicant = async (applicantUserId) => {
    try {
      const result = await updateJob(selectedJob.id, { status: 'in-progress', selectedApplicantId: applicantUserId });
      if (result.success) {
        const updated = postedJobs.map(j => j.id === selectedJob.id ? { ...j, status: 'in-progress', selected_applicant_id: applicantUserId } : j);
        setPostedJobs(updated);
        setSelectedJob(updated.find(j => j.id === selectedJob.id));
        alert('Applicant selected! Job is now In Progress.');
      }
    } catch (e) { alert('Failed: ' + e.message); }
  };

  const handleCompleteJob = async (jobId) => {
    try {
      await updateJob(jobId, { status: 'completed' });
      setPostedJobs(postedJobs.map(j => j.id === jobId ? { ...j, status: 'completed' } : j));
      alert('Job marked as completed!');
    } catch (e) { alert('Failed: ' + e.message); }
  };

  const handleOpenRatingModal = (job) => {
    const selected = applicants.find(a => a.user_id === job.selected_applicant_id);
    setRatingData({ jobId: job.id, workerId: job.selected_applicant_id, workerName: selected?.name || 'Worker', rating: 5, review: '' });
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    if (!ratingData.review.trim()) { alert('Please add a review!'); return; }
    try {
      await submitRating({ jobId: ratingData.jobId, workerId: ratingData.workerId, score: ratingData.rating, review: ratingData.review });
      await updateJob(ratingData.jobId, { status: 'completed', rating: ratingData.rating, review: ratingData.review });
      setPostedJobs(postedJobs.map(j => j.id === ratingData.jobId ? { ...j, status: 'completed', rating: ratingData.rating, review: ratingData.review } : j));
      setShowRatingModal(false);
      setRatingData({ jobId: '', workerId: '', workerName: '', rating: 5, review: '' });
      alert('Rating submitted!');
    } catch (e) { alert('Failed: ' + e.message); }
  };

  const categories = [
    { value: 'construction', label: t.construction }, { value: 'electrical', label: t.electrical },
    { value: 'plumbing', label: t.plumbing }, { value: 'agriculture', label: t.agriculture },
    { value: 'repair', label: t.repair }, { value: 'cleaning', label: t.cleaning }, { value: 'other', label: t.other }
  ];
  const durations = [
    { value: 'hourly', label: t.hourly }, { value: 'daily', label: t.daily },
    { value: 'weekly', label: t.weekly }, { value: 'monthly', label: t.monthly }
  ];
  const urgencies = [
    { value: 'normal', label: t.normal }, { value: 'urgent', label: t.urgent }, { value: 'very-urgent', label: t.veryUrgent }
  ];

  return (
    <div className="container">
      <h1>➕ {t.postJob}</h1>
      <p>👥 {t.findSkilledWorkers}</p>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>📋 {t.jobDetails}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>✏️ {t.jobTitle}</label><input type="text" name="title" value={jobForm.title} onChange={handleChange} required placeholder="e.g., Carpenter needed" /></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>📝 {t.description}</label><textarea name="description" value={jobForm.description} onChange={handleChange} required rows="4" placeholder="Describe the job..." style={{ padding: '12px 15px', border: '2px solid #e0e0e0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', backgroundColor: '#f9f9f9', resize: 'vertical' }} /></div>
          <div className="form-group"><label>📂 {t.category}</label><select name="category" value={jobForm.category} onChange={handleChange} required><option value="">{t.selectCategory}</option>{categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
          <div className="form-group"><label>📍 {t.location}</label><input type="text" name="location" value={jobForm.location} onChange={handleChange} required placeholder="City, Area" /></div>
          <div className="form-group"><label>⏱️ {t.durationType}</label><select name="duration" value={jobForm.duration} onChange={handleChange} required>{durations.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
          <div className="form-group"><label>🔢 {t.durationValue}</label><input type="number" name="durationValue" value={jobForm.durationValue} onChange={handleChange} required min="1" /></div>
          <div className="form-group"><label>💰 {t.budget}</label><input type="number" name="budget" value={jobForm.budget} onChange={handleChange} required placeholder="Amount in rupees" /></div>
          <div className="form-group"><label>🚨 {t.urgency}</label><select name="urgency" value={jobForm.urgency} onChange={handleChange}>{urgencies.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}</select></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>🎯 {t.skillsRequired}</label><input type="text" name="skillsRequired" value={jobForm.skillsRequired} onChange={handleChange} placeholder="e.g., Carpentry, Electrical" /></div>
          <button type="submit" className="register-btn" style={{ gridColumn: '1 / -1' }} disabled={loading}><span className="btn-text">{loading ? '⏳ Posting...' : `🚀 ${t.postJob}`}</span><span className="btn-icon">→</span></button>
        </form>
      </div>

      {postedJobs.length > 0 && (
        <div className="card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>📌 {t.yourPostedJobs}</h2>
          <div className="jobs-list">
            {postedJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div style={{ flex: 1 }}><h3>{job.title}</h3><p style={{ color: '#666', margin: '8px 0' }}>{job.description}</p></div>
                  <span className={`urgency-badge ${job.urgency || 'normal'}`}>{job.urgency?.toUpperCase() || 'NORMAL'}</span>
                </div>
                <div className="job-details">
                  <div className="detail-item"><strong>📍 {t.location}</strong><span>{job.location}</span></div>
                  <div className="detail-item"><strong>🏷️ {t.category}</strong><span>{job.category}</span></div>
                  <div className="detail-item"><strong>⏱️ {t.durationType}</strong><span>{job.duration_value} {job.duration}</span></div>
                  <div className="detail-item"><strong>📊 {t.jobStatus}</strong><span style={{ backgroundColor: job.status === 'open' ? '#667eea' : job.status === 'in-progress' ? '#ffb74d' : '#999', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>{job.status === 'open' ? '🟢 Open' : job.status === 'in-progress' ? '🟡 In Progress' : '⚫ Completed'}</span></div>
                </div>
                <div className="job-footer">
                  <div className="job-provider"><strong style={{ color: '#999' }}>{t.budget}</strong><span style={{ fontSize: '20px', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{job.budget}</span></div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ backgroundColor: (job.applicant_count || 0) > 0 ? '#667eea' : '#ddd', color: (job.applicant_count || 0) > 0 ? 'white' : '#999', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textAlign: 'center', minWidth: '80px' }}>{job.applicant_count || 0} 👤</div>
                    <button onClick={() => handleViewApplicants(job)} className="btn btn-primary" disabled={!job.applicant_count} style={{ opacity: !job.applicant_count ? 0.5 : 1 }}>👥 {t.viewApplicants}</button>
                    {job.status === 'in-progress' && <button onClick={() => handleCompleteJob(job.id)} className="btn btn-secondary">✅ {t.markAsCompleted}</button>}
                    <button onClick={() => handleDeleteJob(job.id)} className="btn btn-danger">🗑️ {t.deleteJob}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applicant Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => { setSelectedJob(null); setApplicants([]); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setSelectedJob(null); setApplicants([]); }}>✕</button>
            <h2 style={{ marginTop: '0' }}>👥 {t.applicants} for: <span style={{ color: '#667eea' }}>{selectedJob.title}</span></h2>
            <p style={{ color: '#999', marginBottom: '25px' }}>Total: <strong>{applicants.length}</strong></p>
            {applicants.length > 0 ? applicants.map(app => {
              const isSelected = selectedJob.selected_applicant_id === app.user_id;
              return (
                <div key={app.id} className="applicant-card" style={{ backgroundColor: isSelected ? '#f0f3ff' : '#f9f9f9', borderLeft: isSelected ? '4px solid #667eea' : '4px solid #ddd' }}>
                  <div style={{ flex: 1 }}>
                    <div className="applicant-name">{isSelected && '⭐ '}{app.name}</div>
                    <div className="applicant-detail">📧 {app.email}</div>
                    {app.skills && <div className="applicant-detail">🔧 <strong>Skills:</strong> {app.skills}</div>}
                    <div className="applicant-detail" style={{ fontSize: '12px', marginTop: '5px' }}>📅 Applied on {new Date(app.applied_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    {selectedJob.status === 'open' && <button onClick={() => handleSelectApplicant(app.user_id)} className={`btn ${isSelected ? 'btn-secondary' : 'btn-primary'}`} style={{ fontSize: '12px', padding: '8px 12px' }}>{isSelected ? '✅ Selected' : '➕ Select'}</button>}
                    {isSelected && <span style={{ backgroundColor: '#667eea', color: 'white', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textAlign: 'center' }}>⭐ {t.selected}</span>}
                  </div>
                </div>
              );
            }) : <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>😔 No applicants yet</p>}
          </div>
        </div>
      )}

      {/* Pending Confirmations */}
      {postedJobs.filter(j => j.status === 'in-progress').length > 0 && (
        <div className="card" style={{ marginTop: '30px', borderLeft: '4px solid #ffb74d' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff6f00' }}>🟡 Pending Confirmations</h2>
          {postedJobs.filter(j => j.status === 'in-progress').map(job => (
            <div key={job.id} className="job-card" style={{ backgroundColor: 'var(--color-bg_secondary)' }}>
              <div className="job-header"><div style={{ flex: 1 }}><h3>{job.title}</h3></div><div style={{ backgroundColor: '#ffb74d', color: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>🟡 IN PROGRESS</div></div>
              <div className="job-footer"><button onClick={() => handleOpenRatingModal(job)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>⭐ Rate & Complete</button></div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Jobs */}
      {postedJobs.filter(j => j.status === 'completed').length > 0 && (
        <div className="card" style={{ marginTop: '30px', borderLeft: '4px solid #66BB6A' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#43A047' }}>✅ Completed Jobs ({postedJobs.filter(j => j.status === 'completed').length})</h2>
          {postedJobs.filter(j => j.status === 'completed').map(job => (
            <div key={job.id} className="job-card" style={{ backgroundColor: 'var(--color-bg_secondary)', opacity: 0.9 }}>
              <div className="job-header"><div style={{ flex: 1 }}><h3>{job.title}</h3></div><div style={{ backgroundColor: '#66BB6A', color: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>✅ COMPLETED</div></div>
              <div className="job-details">
                <div className="detail-item"><strong>💰 Budget</strong><span>₹{job.budget}</span></div>
                <div className="detail-item"><strong>⭐ Rating</strong><span style={{ fontSize: '18px' }}>{'⭐'.repeat(job.rating || 5)}</span></div>
              </div>
              {job.review && <div style={{ backgroundColor: 'var(--color-bg_primary)', padding: '12px', borderRadius: '8px', marginTop: '12px', borderLeft: '3px solid var(--color-accent_primary)' }}><strong>📝 Review:</strong><p style={{ margin: '6px 0 0', color: 'var(--color-text_secondary)' }}>{job.review}</p></div>}
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'var(--color-bg_primary)', borderRadius: '12px', padding: '30px', maxWidth: '400px', width: '90%' }}>
            <h2 style={{ marginTop: 0, color: 'var(--color-accent_primary)' }}>⭐ Rate Worker: {ratingData.workerName}</h2>
            <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontWeight: '600', marginBottom: '10px' }}>Rating:</label><div style={{ display: 'flex', gap: '10px', fontSize: '28px' }}>{[1,2,3,4,5].map(s => <span key={s} onClick={() => setRatingData({...ratingData, rating: s})} style={{ cursor: 'pointer', opacity: s <= ratingData.rating ? 1 : 0.3 }}>⭐</span>)}</div></div>
            <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Review *:</label><textarea value={ratingData.review} onChange={(e) => setRatingData({...ratingData, review: e.target.value})} rows="4" style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '6px', fontFamily: 'inherit', boxSizing: 'border-box' }} /></div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSubmitRating} className="btn btn-primary" style={{ flex: 1 }}>✅ Submit</button>
              <button onClick={() => setShowRatingModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobProvider;