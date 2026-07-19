const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '1234',
  database: 'flexhire'
});

async function createTablesIfMissing() {
  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      user_type TEXT NOT NULL CHECK (user_type IN ('jobSeeker', 'jobProvider')),
      phone TEXT DEFAULT '',
      location TEXT DEFAULT '',
      skills TEXT DEFAULT '',
      experience TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      rating NUMERIC(3,2) DEFAULT 0,
      jobs_completed INTEGER DEFAULT 0,
      is_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Jobs table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      provider_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT DEFAULT 'other',
      location TEXT DEFAULT '',
      duration TEXT DEFAULT 'hourly',
      duration_value INTEGER DEFAULT 1,
      budget TEXT DEFAULT '0',
      skills_required TEXT DEFAULT '',
      urgency TEXT DEFAULT 'normal',
      status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'completed')),
      selected_applicant_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      provider_name TEXT DEFAULT '',
      provider_email TEXT DEFAULT '',
      rating INTEGER DEFAULT 0,
      review TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Applications table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
      paid BOOLEAN DEFAULT false,
      payment_amount NUMERIC(10,2) DEFAULT 0,
      paid_date TIMESTAMPTZ,
      worker_rating INTEGER DEFAULT 0,
      worker_feedback TEXT DEFAULT '',
      completed_date TIMESTAMPTZ,
      applied_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(job_id, user_id)
    )
  `);

  // Ratings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
      worker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      rated_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
      score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
      review TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Blog posts table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      author_name TEXT DEFAULT '',
      author_email TEXT DEFAULT '',
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT DEFAULT 'tips',
      content TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Post likes tracking
  await pool.query(`
    CREATE TABLE IF NOT EXISTS post_likes (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(post_id, user_id)
    )
  `);

  // Comments table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      author_name TEXT DEFAULT '',
      text TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function seedTestAccounts(bcrypt) {
  // Check if test accounts already exist
  const existing = await pool.query("SELECT id FROM users WHERE email IN ('seeker@test.com', 'provider@test.com')");
  if (existing.rows.length >= 2) return;

  const seekerHash = await bcrypt.hash('test123', 10);
  const providerHash = await bcrypt.hash('test123', 10);

  await pool.query(`
    INSERT INTO users (name, email, password_hash, user_type, phone, location, skills)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (email) DO NOTHING
  `, ['Job Seeker', 'seeker@test.com', seekerHash, 'jobSeeker', '1234567890', 'Test City', 'Electrician, Plumber']);

  await pool.query(`
    INSERT INTO users (name, email, password_hash, user_type, phone, location, skills)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (email) DO NOTHING
  `, ['Job Provider', 'provider@test.com', providerHash, 'jobProvider', '0987654321', 'Test City', '']);

  console.log('✅ Test accounts seeded (seeker@test.com / provider@test.com, password: test123)');
}

async function testConnection() {
  const result = await pool.query('SELECT NOW() AS current_time');
  return result.rows[0].current_time;
}

module.exports = {
  pool,
  createTablesIfMissing,
  seedTestAccounts,
  testConnection
};
