import apiClient from './apiClient';

// Soil analysis service
export const soilService = {
  // Submit soil test results
  async createSoilTest(testData) {
    return apiClient.post('/soil/test', testData);
  },

  // Get soil test history
  async getTests(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/soil/tests?${queryParams}`);
  },

  // Get specific soil test by ID
  async getTest(id) {
    return apiClient.get(`/soil/tests/${id}`);
  },

  // Get fertilizer guide for specific crop
  async getFertilizerGuide(cropType, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/soil/fertilizer-guide/${cropType}?${queryParams}`);
  },

  // Get soil health analytics
  async getAnalytics(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/soil/analytics?${queryParams}`);
  },

  // Get soil improvement tracking
  async getImprovementTracking(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/soil/improvement-tracking?${queryParams}`);
  },

  // Get mock soil data for demo
  async getMockData() {
    return apiClient.get('/soil/mock-data');
  }
};