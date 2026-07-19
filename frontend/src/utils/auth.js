// Auth utility - PostgreSQL Backend
// All authentication is handled via the backend API

export {
  register,
  login,
  logout,
  getMe,
  getStoredUser,
  isLoggedIn,
  getUserProfile,
  updateUserProfile,
  createJob,
  getJobs,
  getProviderJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyForJob,
  getJobApplications,
  getUserApplications,
  updateApplication,
  getProviderDashboard,
  getWorkerDashboard,
  createPost,
  getPosts,
  updatePost,
  deletePost,
  toggleLikePost,
  addComment,
  submitRating
} from './api';
