import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getJobs, applyForJob, getUserApplications } from '../utils/api';

const JobSeeker = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [filters, setFilters] = useState({ category: 'all', location: '', duration: 'all', maxBudget: '', search: '' });
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsResult, appsResult] = await Promise.all([
          getJobs({ status: 'open' }),
          getUserApplications(user?.id)
        ]);
        if (jobsResult.success) setJobs(jobsResult.data);
        if (appsResult.success) setAppliedJobIds(appsResult.data.map(a => a.job_id));
      } catch (e) { console.error('Failed to load jobs:', e); }
      finally { setLoading(false); }
    };
    if (user?.id) loadData();
  }, [user]);

  const handleApply = async (jobId) => {
    if (appliedJobIds.includes(jobId)) { alert('You have already applied for this job!'); return; }
    try {
      const result = await applyForJob(jobId);
      if (result.success) {
        setAppliedJobIds([...appliedJobIds, jobId]);
        alert('Applied successfully!');
      } else { alert('Failed to apply: ' + result.error); }
    } catch (e) { alert('Failed to apply: ' + e.message); }
  };

  const filteredJobs = jobs.filter(job => {
    if (filters.category !== 'all' && job.category !== filters.category) return false;
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.duration !== 'all' && job.duration !== filters.duration) return false;
    if (filters.maxBudget && parseInt(job.budget) > parseInt(filters.maxBudget)) return false;
    if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const categories = [
    { value: 'all', label: t.allCategories }, { value: 'construction', label: t.construction },
    { value: 'electrical', label: t.electrical }, { value: 'plumbing', label: t.plumbing },
    { value: 'agriculture', label: t.agriculture }, { value: 'repair', label: t.repair },
    { value: 'cleaning', label: t.cleaning }
  ];
  const durations = [
    { value: 'all', label: t.allDurations }, { value: 'hourly', label: t.hourly },
    { value: 'daily', label: t.daily }, { value: 'weekly', label: t.weekly }, { value: 'monthly', label: t.monthly }
  ];

  if (loading) return <div className="container"><p>Loading jobs...</p></div>;

  return (
    <div className="container">
      <h1>🔍 {t.availableJobs}</h1>
      <p>{t.findWorkMatches}</p>

      <div className="filter-section">
        <h3 style={{ marginTop: '0', marginBottom: '20px', color: '#333' }}>🎯 {t.filterJobs}</h3>
        <div className="filter-grid">
          <div className="form-group"><label>📂 {t.category}</label>
            <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})}>
              {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
            </select>
          </div>
          <div className="form-group"><label>📍 {t.location}</label>
            <input type="text" placeholder={t.location} value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} />
          </div>
          <div className="form-group"><label>⏱️ {t.duration}</label>
            <select value={filters.duration} onChange={(e) => setFilters({...filters, duration: e.target.value})}>
              {durations.map(dur => <option key={dur.value} value={dur.value}>{dur.label}</option>)}
            </select>
          </div>
          <div className="form-group"><label>💰 {t.maxBudget}</label>
            <input type="number" placeholder={t.maxBudget} value={filters.maxBudget} onChange={(e) => setFilters({...filters, maxBudget: e.target.value})} />
          </div>
        </div>
        <div className="form-group"><label>🔎 {t.search}</label>
          <input type="text" className="search-bar" placeholder={t.searchPlaceholder} value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} />
        </div>
      </div>

      <div className="jobs-list">
        {filteredJobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ fontSize: '18px', color: '#999', margin: '0' }}>😔 {t.noJobsFound}</p>
            <p style={{ fontSize: '14px', color: '#bbb', margin: '10px 0 0 0' }}>Try adjusting your filters to find more jobs</p>
          </div>
        ) : (
          filteredJobs.map(job => {
            const hasUserApplied = appliedJobIds.includes(job.id);
            return (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div style={{ flex: 1 }}>
                    <h3>{job.title}</h3>
                    <p style={{ color: '#666', margin: '5px 0', fontSize: '13px' }}>Posted by <strong>{job.provider_name}</strong></p>
                    <p style={{ color: '#666', margin: '8px 0' }}>{job.description}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`urgency-badge ${job.urgency || 'normal'}`}>{job.urgency?.toUpperCase() || 'NORMAL'}</span>
                  </div>
                </div>
                <div className="job-details">
                  <div className="detail-item"><strong>📍 {t.location}</strong><span>{job.location}</span></div>
                  <div className="detail-item"><strong>🏷️ {t.category}</strong><span>{job.category}</span></div>
                  <div className="detail-item"><strong>⏱️ {t.durationType}</strong><span>{job.duration_value} {job.duration}</span></div>
                  <div className="detail-item"><strong>🔧 {t.skillsRequired}</strong><span>{job.skills_required}</span></div>
                </div>
                <div className="job-footer">
                  <div className="job-provider">
                    <strong style={{ color: '#999' }}>{t.budget}</strong>
                    <span style={{ fontSize: '20px', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{job.budget}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right', fontSize: '13px', color: '#666' }}>{job.applicant_count || 0} {t.applicants?.toLowerCase() || 'applicants'} so far</div>
                    <button onClick={() => handleApply(job.id)} className={`btn ${hasUserApplied ? 'btn-secondary' : 'btn-primary'}`}
                      disabled={hasUserApplied} style={{ opacity: hasUserApplied ? 0.6 : 1, cursor: hasUserApplied ? 'not-allowed' : 'pointer' }}>
                      {hasUserApplied ? '✅ ' + t.applied : '➕ ' + t.applyNow}
                    </button>
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