const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool, createTablesIfMissing, seedTestAccounts, testConnection } = require('./db');

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'flexhire_secret_key_2024';

app.use(cors());
app.use(express.json());

// JWT middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch { return res.status(401).json({ success: false, error: 'Invalid token' }); }
};

// ===== HEALTH =====
app.get('/api/health', async (req, res) => {
  try {
    const t = await testConnection();
    res.json({ success: true, message: 'Server running', currentTime: t });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ===== AUTH =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, userType, phone, location, skills } = req.body;
    if (!name || !email || !password || !userType) return res.status(400).json({ success: false, error: 'Missing required fields' });
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, user_type, phone, location, skills) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, name, email, user_type, phone, location, skills, rating, jobs_completed, bio, experience, created_at`,
      [name, email, hash, userType, phone || '', location || '', skills || '']
    );
    res.json({ success: true, message: 'Registration successful', user: result.rows[0] });
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ success: false, error: 'Email already registered' });
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ success: false, error: 'Invalid email or password' });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ success: false, error: 'Invalid email or password' });
    const token = jwt.sign({ id: user.id, email: user.email, userType: user.user_type }, JWT_SECRET, { expiresIn: '7d' });
    const { password_hash, ...userData } = user;
    res.json({ success: true, token, user: userData });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, user_type, phone, location, skills, experience, bio, rating, jobs_completed, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ===== USERS =====
app.get('/api/users/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, user_type, phone, location, skills, experience, bio, rating, jobs_completed, created_at FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/users/:id', authenticate, async (req, res) => {
  try {
    const { name, phone, location, skills, experience, bio } = req.body;
    const result = await pool.query(
      `UPDATE users SET name=COALESCE($1,name), phone=COALESCE($2,phone), location=COALESCE($3,location), skills=COALESCE($4,skills), experience=COALESCE($5,experience), bio=COALESCE($6,bio), updated_at=NOW() WHERE id=$7 RETURNING id, name, email, user_type, phone, location, skills, experience, bio, rating, jobs_completed`,
      [name, phone, location, skills, experience, bio, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ===== JOBS =====
app.post('/api/jobs', authenticate, async (req, res) => {
  try {
    const { title, description, category, location, duration, durationValue, budget, skillsRequired, urgency } = req.body;
    const userResult = await pool.query('SELECT name, email FROM users WHERE id=$1', [req.user.id]);
    const u = userResult.rows[0];
    const result = await pool.query(
      `INSERT INTO jobs (provider_id, title, description, category, location, duration, duration_value, budget, skills_required, urgency, provider_name, provider_email) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [req.user.id, title, description||'', category||'other', location||'', duration||'hourly', durationValue||1, budget||'0', skillsRequired||'', urgency||'normal', u.name, u.email]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const { category, location, search, status } = req.query;
    let q = 'SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id=j.id) as applicant_count FROM jobs j WHERE 1=1';
    const params = [];
    let i = 1;
    if (status) { q += ` AND j.status=$${i++}`; params.push(status); }
    if (category && category !== 'all') { q += ` AND j.category=$${i++}`; params.push(category); }
    if (location) { q += ` AND LOWER(j.location) LIKE $${i++}`; params.push(`%${location.toLowerCase()}%`); }
    if (search) { q += ` AND LOWER(j.title) LIKE $${i++}`; params.push(`%${search.toLowerCase()}%`); }
    q += ' ORDER BY j.created_at DESC';
    const result = await pool.query(q, params);
    res.json({ success: true, data: result.rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/jobs/provider/:providerId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id=j.id) as applicant_count FROM jobs j WHERE j.provider_id=$1 ORDER BY j.created_at DESC',
      [req.params.providerId]
    );
    res.json({ success: true, data: result.rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Job not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/jobs/:id', authenticate, async (req, res) => {
  try {
    const { status, selectedApplicantId, rating, review } = req.body;
    const result = await pool.query(
      `UPDATE jobs SET status=COALESCE($1,status), selected_applicant_id=COALESCE($2,selected_applicant_id), rating=COALESCE($3,rating), review=COALESCE($4,review), updated_at=NOW() WHERE id=$5 RETURNING *`,
      [status, selectedApplicantId, rating, review, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete('/api/jobs/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM jobs WHERE id=$1 AND provider_id=$2', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Job deleted' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ===== APPLICATIONS =====
app.post('/api/applications', authenticate, async (req, res) => {
  try {
    const { jobId } = req.body;
    const result = await pool.query(
      'INSERT INTO applications (job_id, user_id) VALUES ($1,$2) RETURNING *',
      [jobId, req.user.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ success: false, error: 'Already applied' });
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/api/applications/job/:jobId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT a.*, u.name, u.email, u.skills, u.phone, u.location, u.rating as user_rating FROM applications a JOIN users u ON a.user_id=u.id WHERE a.job_id=$1 ORDER BY a.applied_at DESC',
      [req.params.jobId]
    );
    res.json({ success: true, data: result.rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/applications/user/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT a.*, j.title as job_title, j.budget, j.status as job_status, j.location as job_location FROM applications a JOIN jobs j ON a.job_id=j.id WHERE a.user_id=$1 ORDER BY a.applied_at DESC',
      [req.params.userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/applications/:id', authenticate, async (req, res) => {
  try {
    const { status, paid, paymentAmount, workerRating, workerFeedback } = req.body;
    let q = 'UPDATE applications SET updated_at=NOW()';
    const params = [];
    let i = 1;
    if (status) { q += `, status=$${i++}`; params.push(status); }
    if (paid !== undefined) { q += `, paid=$${i++}, paid_date=NOW()`; params.push(paid); }
    if (paymentAmount) { q += `, payment_amount=$${i++}`; params.push(paymentAmount); }
    if (workerRating) { q += `, worker_rating=$${i++}`; params.push(workerRating); }
    if (workerFeedback !== undefined) { q += `, worker_feedback=$${i++}`; params.push(workerFeedback); }
    if (status === 'completed') { q += `, completed_date=NOW()`; }
    q += ` WHERE id=$${i++} RETURNING *`;
    params.push(req.params.id);
    const result = await pool.query(q, params);
    res.json({ success: true, data: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ===== DASHBOARD STATS =====
app.get('/api/dashboard/provider/:userId', authenticate, async (req, res) => {
  try {
    const uid = req.params.userId;
    const jobs = await pool.query('SELECT * FROM jobs WHERE provider_id=$1', [uid]);
    const allJobs = jobs.rows;
    const jobIds = allJobs.map(j => j.id);

    let activeWorkers = [], pendingPayments = [], completedWorks = [], totalCredits = 0, totalApps = 0;

    if (jobIds.length > 0) {
      const appsResult = await pool.query(
        `SELECT a.*, u.name, u.email, u.skills, j.title as job_title, j.budget, j.id as j_id FROM applications a JOIN users u ON a.user_id=u.id JOIN jobs j ON a.job_id=j.id WHERE a.job_id = ANY($1)`,
        [jobIds]
      );
      totalApps = appsResult.rows.length;
      appsResult.rows.forEach(app => {
        if (app.status === 'accepted') {
          const job = allJobs.find(j => j.id === app.j_id);
          if (job && job.status === 'in-progress') activeWorkers.push({ ...app, jobTitle: app.job_title });
        }
        if (app.status === 'completed' && !app.paid) {
          pendingPayments.push({ ...app, jobTitle: app.job_title, completedDate: app.completed_date || new Date().toISOString() });
        }
        if (app.paid && app.worker_rating > 0) {
          const credits = app.worker_rating * 10;
          totalCredits += credits;
          completedWorks.push({ ...app, jobTitle: app.job_title, credits, paidDate: app.paid_date });
        }
      });
    }

    res.json({
      success: true,
      data: {
        stats: {
          postedJobs: allJobs.length,
          activeJobs: allJobs.filter(j => j.status === 'open' || j.status === 'in-progress').length,
          completedJobs: allJobs.filter(j => j.status === 'completed').length,
          totalApplications: totalApps,
          budgetSpent: allJobs.reduce((s, j) => s + parseInt(j.budget || 0), 0),
          activeWorkers: activeWorkers.length,
          totalCompletedWorks: completedWorks.length
        },
        activeWorkers,
        pendingPayments,
        completedWorks: completedWorks.sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate)),
        totalCredits,
        recentJobs: allJobs.slice(-3).reverse()
      }
    });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/dashboard/worker/:userId', authenticate, async (req, res) => {
  try {
    const uid = req.params.userId;
    const apps = await pool.query(
      'SELECT a.*, j.title as job_title, j.budget, j.status as job_status FROM applications a JOIN jobs j ON a.job_id=j.id WHERE a.user_id=$1 ORDER BY a.applied_at DESC',
      [uid]
    );
    const userApps = apps.rows;
    const activeJobs = userApps.filter(a => a.job_status === 'open' || a.job_status === 'in-progress').length;
    const completedJobs = userApps.filter(a => a.job_status === 'completed').length;
    const earnings = userApps.filter(a => a.paid).reduce((s, a) => s + parseFloat(a.payment_amount || 0), 0);
    const userResult = await pool.query('SELECT rating FROM users WHERE id=$1', [uid]);

    res.json({
      success: true,
      data: {
        stats: { activeJobs, completedJobs, rating: userResult.rows[0]?.rating || 0, earnings },
        recentApplications: userApps.slice(0, 5)
      }
    });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ===== BLOG POSTS =====
app.post('/api/posts', authenticate, async (req, res) => {
  try {
    const { title, description, category, content } = req.body;
    const userResult = await pool.query('SELECT name, email FROM users WHERE id=$1', [req.user.id]);
    const u = userResult.rows[0];
    const result = await pool.query(
      'INSERT INTO posts (author_id, author_name, author_email, title, description, category, content) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [req.user.id, u.name, u.email, title, description||'', category||'tips', content]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/posts', async (req, res) => {
  try {
    const { category, search, authorId } = req.query;
    let q = `SELECT p.*, COALESCE(json_agg(json_build_object('id',c.id,'author_id',c.author_id,'author_name',c.author_name,'text',c.text,'likes',c.likes,'created_at',c.created_at)) FILTER (WHERE c.id IS NOT NULL), '[]') as comments, COALESCE(array_agg(pl.user_id) FILTER (WHERE pl.user_id IS NOT NULL), '{}') as liked_by FROM posts p LEFT JOIN comments c ON c.post_id=p.id LEFT JOIN post_likes pl ON pl.post_id=p.id WHERE 1=1`;
    const params = [];
    let i = 1;
    if (category && category !== 'all' && category !== 'my-posts') { q += ` AND p.category=$${i++}`; params.push(category); }
    if (authorId) { q += ` AND p.author_id=$${i++}`; params.push(authorId); }
    if (search) { q += ` AND (LOWER(p.title) LIKE $${i} OR LOWER(p.content) LIKE $${i++})`; params.push(`%${search.toLowerCase()}%`); }
    q += ' GROUP BY p.id ORDER BY p.created_at DESC';
    const result = await pool.query(q, params);
    res.json({ success: true, data: result.rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.put('/api/posts/:id', authenticate, async (req, res) => {
  try {
    const { title, description, category, content } = req.body;
    const result = await pool.query(
      'UPDATE posts SET title=COALESCE($1,title), description=COALESCE($2,description), category=COALESCE($3,category), content=COALESCE($4,content), updated_at=NOW() WHERE id=$5 AND author_id=$6 RETURNING *',
      [title, description, category, content, req.params.id, req.user.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete('/api/posts/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM posts WHERE id=$1 AND author_id=$2', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Post deleted' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/posts/:id/like', authenticate, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const existing = await pool.query('SELECT id FROM post_likes WHERE post_id=$1 AND user_id=$2', [postId, userId]);
    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM post_likes WHERE post_id=$1 AND user_id=$2', [postId, userId]);
      await pool.query('UPDATE posts SET likes=likes-1 WHERE id=$1', [postId]);
    } else {
      await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES ($1,$2)', [postId, userId]);
      await pool.query('UPDATE posts SET likes=likes+1 WHERE id=$1', [postId]);
    }
    const result = await pool.query('SELECT likes FROM posts WHERE id=$1', [postId]);
    const likesResult = await pool.query('SELECT user_id FROM post_likes WHERE post_id=$1', [postId]);
    res.json({ success: true, likes: result.rows[0].likes, likedBy: likesResult.rows.map(r => r.user_id) });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/posts/:id/comments', authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    const userResult = await pool.query('SELECT name FROM users WHERE id=$1', [req.user.id]);
    const result = await pool.query(
      'INSERT INTO comments (post_id, author_id, author_name, text) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.params.id, req.user.id, userResult.rows[0].name, text]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ===== RATINGS =====
app.post('/api/ratings', authenticate, async (req, res) => {
  try {
    const { jobId, workerId, score, review } = req.body;
    const result = await pool.query(
      'INSERT INTO ratings (job_id, worker_id, rated_by, score, review) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [jobId, workerId, req.user.id, score, review||'']
    );
    // Update worker average rating
    const avgResult = await pool.query('SELECT AVG(score) as avg_rating FROM ratings WHERE worker_id=$1', [workerId]);
    await pool.query('UPDATE users SET rating=$1 WHERE id=$2', [parseFloat(avgResult.rows[0].avg_rating).toFixed(2), workerId]);
    res.json({ success: true, data: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ===== STARTUP =====
async function startServer() {
  try {
    const currentTime = await testConnection();
    console.log(`✅ Connected to PostgreSQL at ${currentTime}`);
    await createTablesIfMissing();
    console.log('✅ Database tables ready');
    await seedTestAccounts(bcrypt);
    app.listen(port, () => console.log(`🚀 Backend server running on http://localhost:${port}`));
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
