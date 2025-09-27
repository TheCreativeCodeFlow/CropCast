import apiClient from './apiClient';

// User service
export const userService = {
  // Get dashboard data
  async getDashboardData() {
    return apiClient.get('/user/dashboard');
  },

  // Update user preferences
  async updatePreferences(preferences) {
    return apiClient.put('/user/preferences', preferences);
  },

  // Update farm details
  async updateFarmDetails(farmDetails) {
    return apiClient.put('/user/farm-details', farmDetails);
  },

  // Get user activity feed
  async getActivityFeed(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/user/activity-feed?${queryParams}`);
  },

  // Get user statistics
  async getStatistics(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/user/statistics?${queryParams}`);
  },

  // Update user location
  async updateLocation(locationData) {
    return apiClient.put('/user/location', locationData);
  }
};