import apiClient from './apiClient';

// Pest detection service
export const pestDetectionService = {
  // Analyze image for pest detection
  async analyzeImage(file, cropType, location = null) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('cropType', cropType);
    if (location) {
      formData.append('location', JSON.stringify(location));
    }

    return apiClient.postFormData('/pest-detection/analyze', formData);
  },

  // Get pest detection history
  async getHistory(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/pest-detection/history?${queryParams}`);
  },

  // Get specific detection by ID
  async getDetection(id) {
    return apiClient.get(`/pest-detection/${id}`);
  },

  // Get pest statistics and insights
  async getStats(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/pest-detection/stats/insights?${queryParams}`);
  },

  // Get common pests information
  async getCommonPests(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/pest-detection/info/common?${queryParams}`);
  },

  // Add expert review (for expert users)
  async addExpertReview(id, reviewData) {
    return apiClient.post(`/pest-detection/${id}/review`, reviewData);
  }
};