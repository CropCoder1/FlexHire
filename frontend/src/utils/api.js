const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('flexhire_token');
}

function setToken(token) {
  localStorage.setItem('flexhire_token', token);
}

function clearToken() {
  localStorage.removeItem('flexhire_token');
  localStorage.removeItem('flexhire_user');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// ===== AUTH =====
export async function register(userData) {
  const data = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  return data;
}

export async function login(email, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (data.success && data.token) {
    setToken(data.token);
    localStorage.setItem('flexhire_user', JSON.stringify(data.user));
  }
  return data;
}

export function logout() {
  clearToken();
}

export async function getMe() {
  return request('/api/auth/me');
}

export function getStoredUser() {
  const u = localStorage.getItem('flexhire_user');
  return u ? JSON.parse(u) : null;
}

export function isLoggedIn() {
  return !!getToken();
}

// ===== USERS =====
export async function getUserProfile(userId) {
  return request(`/api/users/${userId}`);
}

export async function updateUserProfile(userId, profileData) {
  const data = await request(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
  // Update stored user
  if (data.success) {
    const stored = getStoredUser();
    if (stored && stored.id === userId) {
      localStorage.setItem('flexhire_user', JSON.stringify({ ...stored, ...data.data }));
    }
  }
  return data;
}

// ===== JOBS =====
export async function createJob(jobData) {
  return request('/api/jobs', { method: 'POST', body: JSON.stringify(jobData) });
}

export async function getJobs(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v && v !== 'all') params.append(k, v); });
  return request(`/api/jobs?${params.toString()}`);
}

export async function getProviderJobs(providerId) {
  return request(`/api/jobs/provider/${providerId}`);
}

export async function getJobById(jobId) {
  return request(`/api/jobs/${jobId}`);
}

export async function updateJob(jobId, updateData) {
  return request(`/api/jobs/${jobId}`, { method: 'PUT', body: JSON.stringify(updateData) });
}

export async function deleteJob(jobId) {
  return request(`/api/jobs/${jobId}`, { method: 'DELETE' });
}

// ===== APPLICATIONS =====
export async function applyForJob(jobId) {
  return request('/api/applications', { method: 'POST', body: JSON.stringify({ jobId }) });
}

export async function getJobApplications(jobId) {
  return request(`/api/applications/job/${jobId}`);
}

export async function getUserApplications(userId) {
  return request(`/api/applications/user/${userId}`);
}

export async function updateApplication(appId, updateData) {
  return request(`/api/applications/${appId}`, { method: 'PUT', body: JSON.stringify(updateData) });
}

// ===== DASHBOARD =====
export async function getProviderDashboard(userId) {
  return request(`/api/dashboard/provider/${userId}`);
}

export async function getWorkerDashboard(userId) {
  return request(`/api/dashboard/worker/${userId}`);
}

// ===== BLOG POSTS =====
export async function createPost(postData) {
  return request('/api/posts', { method: 'POST', body: JSON.stringify(postData) });
}

export async function getPosts(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
  return request(`/api/posts?${params.toString()}`);
}

export async function updatePost(postId, postData) {
  return request(`/api/posts/${postId}`, { method: 'PUT', body: JSON.stringify(postData) });
}

export async function deletePost(postId) {
  return request(`/api/posts/${postId}`, { method: 'DELETE' });
}

export async function toggleLikePost(postId) {
  return request(`/api/posts/${postId}/like`, { method: 'POST' });
}

export async function addComment(postId, text) {
  return request(`/api/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ text }) });
}

// ===== RATINGS =====
export async function submitRating(ratingData) {
  return request('/api/ratings', { method: 'POST', body: JSON.stringify(ratingData) });
}
