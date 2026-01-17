// This simulates a shared database for all users
class DataManager {
  constructor() {
    this.storageKey = 'flexhire_shared_data';
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        jobs: [],
        users: [],
        applications: [],
        ratings: []
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  getData() {
    const data = localStorage.getItem(this.storageKey);
    return JSON.parse(data);
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Jobs operations
  addJob(job) {
    const data = this.getData();
    data.jobs.push(job);
    this.saveData(data);
    return job;
  }

  getJobs() {
    const data = this.getData();
    return data.jobs;
  }

  getJobById(jobId) {
    const data = this.getData();
    return data.jobs.find(job => job.id === jobId);
  }

  updateJob(jobId, updates) {
    const data = this.getData();
    const jobIndex = data.jobs.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
      data.jobs[jobIndex] = { ...data.jobs[jobIndex], ...updates };
      this.saveData(data);
      return data.jobs[jobIndex];
    }
    return null;
  }

  deleteJob(jobId) {
    const data = this.getData();
    data.jobs = data.jobs.filter(job => job.id !== jobId);
    // Also remove applications for this job
    data.applications = data.applications.filter(app => app.jobId !== jobId);
    this.saveData(data);
  }

  // Applications operations
  addApplication(application) {
    const data = this.getData();
    data.applications.push(application);
    this.saveData(data);
    return application;
  }

  getApplicationsByJobId(jobId) {
    const data = this.getData();
    return data.applications.filter(app => app.jobId === jobId);
  }

  getApplicationsByUserId(userId) {
    const data = this.getData();
    return data.applications.filter(app => app.userId === userId);
  }

  // Users operations
  addUser(user) {
    const data = this.getData();
    data.users.push(user);
    this.saveData(data);
    return user;
  }

  getUserById(userId) {
    const data = this.getData();
    return data.users.find(user => user.id === userId);
  }

  // Ratings operations
  addRating(rating) {
    const data = this.getData();
    data.ratings.push(rating);
    this.saveData(data);
    return rating;
  }

  getRatingsByUserId(userId) {
    const data = this.getData();
    return data.ratings.filter(rating => rating.userId === userId);
  }

  getAverageRating(userId) {
    const ratings = this.getRatingsByUserId(userId);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((total, rating) => total + rating.score, 0);
    return sum / ratings.length;
  }

  // Get jobs posted by a specific provider
  getJobsByProviderId(providerId) {
    const data = this.getData();
    return data.jobs.filter(job => job.providerId === providerId);
  }

  // Get all applicants for all jobs of a provider
  getAllApplicantsForProvider(providerId) {
    const providerJobs = this.getJobsByProviderId(providerId);
    const allApplications = [];
    
    providerJobs.forEach(job => {
      const jobApplications = this.getApplicationsByJobId(job.id);
      jobApplications.forEach(app => {
        const user = this.getUserById(app.userId);
        allApplications.push({
          ...app,
          jobTitle: job.title,
          jobId: job.id,
          applicantName: user ? user.name : 'Unknown',
          applicantEmail: user ? user.email : 'Unknown'
        });
      });
    });
    
    return allApplications;
  }
}

// Create a singleton instance
const dataManager = new DataManager();
export default dataManager;