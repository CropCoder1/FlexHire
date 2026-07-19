import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LiveTime from './LiveTime';
import { getProviderDashboard, updateApplication } from '../utils/api';

const ProviderDashboard = ({ user }) => {
  const [stats, setStats] = useState({ postedJobs: 0, activeJobs: 0, completedJobs: 0, totalApplications: 0, budgetSpent: 0, activeWorkers: 0, totalCompletedWorks: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeWorkers, setActiveWorkers] = useState([]);
  const [paymentPending, setPaymentPending] = useState([]);
  const [completedWorks, setCompletedWorks] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const result = await getProviderDashboard(user?.id);
      if (result.success) {
        const d = result.data;
        setStats(d.stats);
        setActiveWorkers(d.activeWorkers || []);
        setPaymentPending(d.pendingPayments || []);
        setCompletedWorks(d.completedWorks || []);
        setTotalCredits(d.totalCredits || 0);
        setRecentActivity(d.recentJobs || []);
      }
    } catch (e) { console.error('Failed to load dashboard:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user?.id) loadDashboard(); }, [user]);

  const handlePaymentSubmit = async () => {
    if (!selectedWork || !paymentAmount || rating === 0) { alert('Please fill all fields'); return; }
    try {
      await updateApplication(selectedWork.id, { paid: true, paymentAmount: parseFloat(paymentAmount), workerRating: rating, workerFeedback: feedback, status: 'completed' });
      alert(`✅ Payment of ₹${paymentAmount} processed!\n⭐ Rating: ${rating} stars`);
      setShowPaymentModal(false); setPaymentAmount(''); setRating(5); setFeedback(''); setSelectedWork(null);
      loadDashboard();
    } catch (e) { alert('Payment failed: ' + e.message); }
  };

  if (loading) return <div className="container"><p>Loading dashboard...</p></div>;

  return (
    <div className="container">
      <LiveTime />
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '5px' }}>Welcome back, <span style={{ color: 'var(--color-accent_primary)', fontWeight: '900', letterSpacing: '1px' }}>{user?.name}</span>! 👔</h1>
        <p style={{ color: 'var(--color-text_secondary)', marginBottom: '0', fontSize: '16px' }}>Manage your jobs, view applications, and find the right talent!</p>
      </div>

      <div className="dashboard-cards">
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--color-accent_primary) 0.5%, var(--color-bg_secondary) 100%)', borderLeft: '4px solid var(--color-accent_primary)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0', color: 'var(--color-text_primary)' }}>⚡ Quick Actions</h3>
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/job-provider" className="btn btn-primary">➕ Post New Job</Link>
            <Link to="/profile" className="btn btn-secondary">👤 Manage Profile</Link>
            <Link to="/blog" className="btn btn-secondary">📝 View Blog</Link>
          </div>
        </div>

        <div className="stats-grid">
          {[
            { icon: '📌', label: 'Posted Jobs', sub: 'Total published', value: stats.postedJobs },
            { icon: '🟢', label: 'Active Now', sub: 'Looking for workers', value: stats.activeJobs },
            { icon: '👥', label: 'Applications', sub: 'Total received', value: stats.totalApplications },
            { icon: '💰', label: 'Budget Used', sub: 'Total allocated', value: `₹${stats.budgetSpent}` },
            { icon: '👷', label: 'Active Workers', sub: 'Currently working', value: stats.activeWorkers },
            { icon: '✅', label: 'Completed', sub: 'Jobs finished', value: stats.completedJobs }
          ].map((s, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
                <div><h4 style={{ marginTop: '0', marginBottom: '5px', color: 'var(--color-text_primary)' }}>{s.icon} {s.label}</h4><p style={{ fontSize: '12px', color: 'var(--color-text_secondary)', margin: '0' }}>{s.sub}</p></div>
                <p style={{ fontSize: '36px', fontWeight: '700', color: 'var(--color-accent_primary)', margin: '0' }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Credits */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div className="card">
            <h3 style={{ marginTop: '0', marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text_primary)' }}>💎 Total Credits</h3>
            <p style={{ margin: '0', fontSize: '42px', fontWeight: '900', marginBottom: '5px', color: 'var(--color-text_primary)' }}>{totalCredits}</p>
            <p style={{ margin: '0', fontSize: '13px', color: 'var(--color-text_secondary)' }}>Credits from {stats.totalCompletedWorks} completed works</p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: '0', marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text_primary)' }}>⭐ Work Completed</h3>
            <p style={{ margin: '0', fontSize: '42px', fontWeight: '900', marginBottom: '5px', color: 'var(--color-text_primary)' }}>{stats.totalCompletedWorks}</p>
          </div>
        </div>

        {/* Completed Works History */}
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0', color: 'var(--color-accent_primary)', fontSize: '18px' }}>📊 Work Completed & Ratings ({completedWorks.length})</h3>
          {completedWorks.length > 0 ? completedWorks.map((work, idx) => (
            <div key={work.id} style={{ padding: '15px', backgroundColor: 'var(--color-bg_secondary)', borderRadius: '8px', marginBottom: idx < completedWorks.length - 1 ? '12px' : '0', borderLeft: '4px solid var(--color-accent_primary)', marginTop: idx === 0 ? '20px' : '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 3px 0', fontWeight: '700', color: 'var(--color-text_primary)', fontSize: '15px' }}>{work.name}</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--color-accent_primary)', fontWeight: '600' }}>✅ {work.jobTitle}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', fontSize: '12px', color: 'var(--color-text_secondary)' }}>
                    <span>💰 Amount: ₹{work.budget}</span>
                    <span>📅 Paid: {new Date(work.paidDate).toLocaleDateString()}</span>
                    <span>💎 Credits: {work.credits}</span>
                  </div>
                  {work.worker_feedback && <div style={{ marginTop: '10px', padding: '10px', backgroundColor: 'var(--color-bg_primary)', borderRadius: '6px', fontSize: '12px', color: 'var(--color-text_secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--color-accent_primary)' }}>💬 {work.worker_feedback}</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', minWidth: '80px' }}>
                  <div style={{ fontSize: '28px', display: 'flex', gap: '2px' }}>{[...Array(5)].map((_, i) => <span key={i} style={{ opacity: i < work.worker_rating ? '1' : '0.3' }}>⭐</span>)}</div>
                  <span style={{ backgroundColor: 'var(--color-accent_primary)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{work.worker_rating}/5</span>
                </div>
              </div>
            </div>
          )) : <div style={{ padding: '30px', textAlign: 'center', backgroundColor: 'var(--color-bg_secondary)', borderRadius: '8px', marginTop: '15px' }}><p style={{ fontSize: '14px', color: 'var(--color-text_secondary)', margin: '0' }}>📈 No completed work history yet.</p></div>}
        </div>

        {/* Recent Jobs */}
        {recentActivity.length > 0 && (
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0' }}>📋 Recent Jobs Posted</h3>
            <div style={{ marginTop: '15px' }}>
              {recentActivity.map((job, idx) => (
                <div key={job.id} style={{ padding: '12px', backgroundColor: 'var(--color-bg_secondary)', borderRadius: '8px', marginBottom: idx < recentActivity.length - 1 ? '10px' : '0', borderLeft: '4px solid var(--color-accent_primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}><p style={{ margin: '0 0 3px 0', fontWeight: '600', color: 'var(--color-text_primary)' }}>{job.title}</p><p style={{ margin: '0', fontSize: '12px', color: 'var(--color-text_secondary)' }}>Budget: ₹{job.budget} • Posted on {new Date(job.created_at).toLocaleDateString()}</p></div>
                  <span style={{ backgroundColor: job.status === 'open' ? '#4CAF50' : job.status === 'in-progress' ? 'var(--color-accent_primary)' : '#999', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize', whiteSpace: 'nowrap', marginLeft: '10px' }}>{job.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Workers */}
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0', color: 'var(--color-accent_primary)' }}>👷 Currently Working ({activeWorkers.length})</h3>
          {activeWorkers.length > 0 ? activeWorkers.map((w, idx) => (
            <div key={w.id} style={{ padding: '15px', backgroundColor: 'var(--color-bg_secondary)', borderRadius: '8px', marginBottom: idx < activeWorkers.length - 1 ? '12px' : '0', borderLeft: '4px solid var(--color-accent_secondary)', marginTop: idx === 0 ? '15px' : '0' }}>
              <p style={{ margin: '0 0 3px 0', fontWeight: '700', color: 'var(--color-text_primary)', fontSize: '15px' }}>{w.name}</p>
              <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: 'var(--color-accent_primary)', fontWeight: '600' }}>📌 {w.jobTitle}</p>
              <p style={{ margin: '0', fontSize: '12px', color: 'var(--color-text_secondary)' }}>💼 Budget: ₹{w.budget}</p>
            </div>
          )) : <div style={{ padding: '30px', textAlign: 'center', backgroundColor: 'var(--color-bg_secondary)', borderRadius: '8px', marginTop: '15px' }}><p style={{ fontSize: '14px', color: 'var(--color-text_secondary)', margin: '0' }}>👥 No active workers yet.</p></div>}
        </div>

        {/* Payment Pending */}
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0', color: 'var(--color-accent_secondary)' }}>💳 Awaiting Payment ({paymentPending.length})</h3>
          {paymentPending.length > 0 ? paymentPending.map((w, idx) => (
            <div key={w.id} style={{ padding: '15px', backgroundColor: 'var(--color-bg_secondary)', borderRadius: '8px', marginBottom: idx < paymentPending.length - 1 ? '12px' : '0', borderLeft: '4px solid var(--color-accent_secondary)', marginTop: idx === 0 ? '15px' : '0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 3px 0', fontWeight: '700', color: 'var(--color-text_primary)' }}>{w.name}</p>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: 'var(--color-accent_primary)', fontWeight: '600' }}>✅ {w.jobTitle}</p>
                <p style={{ margin: '0', fontSize: '12px', color: 'var(--color-text_secondary)' }}>💰 ₹{w.budget}</p>
              </div>
              <button onClick={() => { setSelectedWork(w); setPaymentAmount(w.budget); setShowPaymentModal(true); }}
                style={{ backgroundColor: 'var(--color-accent_secondary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>💳 Pay & Rate</button>
            </div>
          )) : <div style={{ padding: '30px', textAlign: 'center', backgroundColor: 'var(--color-bg_secondary)', borderRadius: '8px', marginTop: '15px' }}><p style={{ fontSize: '14px', color: 'var(--color-text_secondary)', margin: '0' }}>✨ No pending payments.</p></div>}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedWork && (
          <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999' }}>
            <div style={{ backgroundColor: 'var(--color-bg_primary)', borderRadius: '12px', padding: '30px', maxWidth: '450px', width: '90%', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ marginTop: '0', marginBottom: '20px', color: 'var(--color-accent_primary)' }}>💳 Process Payment</h2>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text_primary)' }}>Worker:</label><p style={{ margin: '0', padding: '10px', backgroundColor: 'var(--color-bg_secondary)', borderRadius: '6px', color: 'var(--color-text_primary)' }}>{selectedWork.name}</p></div>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text_primary)' }}>Amount (₹):</label><input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'var(--color-bg_secondary)', color: 'var(--color-text_primary)', fontSize: '14px', boxSizing: 'border-box' }} /></div>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', color: 'var(--color-text_primary)' }}>⭐ Rating:</label><div style={{ display: 'flex', gap: '10px', fontSize: '28px' }}>{[1,2,3,4,5].map(s => <span key={s} onClick={() => setRating(s)} style={{ cursor: 'pointer', opacity: s <= rating ? '1' : '0.3' }}>⭐</span>)}</div></div>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text_primary)' }}>Feedback:</label><textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Share your experience..." style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'var(--color-bg_secondary)', color: 'var(--color-text_primary)', fontSize: '13px', fontFamily: 'inherit', minHeight: '80px', boxSizing: 'border-box', resize: 'vertical' }} /></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handlePaymentSubmit} style={{ flex: 1, padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>✅ Confirm Payment</button>
                <button onClick={() => { setShowPaymentModal(false); setSelectedWork(null); setPaymentAmount(''); setRating(5); setFeedback(''); }} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--color-bg_secondary)', color: 'var(--color-text_primary)', border: '1px solid var(--color-border)', borderRadius: '6px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
