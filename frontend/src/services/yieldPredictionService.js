import apiClient from './apiClient';

// Yield prediction service
export const yieldPredictionService = {
  // Create yield prediction
  async createPrediction(predictionData) {
    return apiClient.post('/yield-prediction/predict', predictionData);
  },

  // Get prediction history
  async getHistory(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/yield-prediction/history?${queryParams}`);
  },

  // Get specific prediction by ID
  async getPrediction(id) {
    return apiClient.get(`/yield-prediction/${id}`);
  },

  // Update actual yield after harvest
  async updateActualYield(id, yieldData) {
    return apiClient.put(`/yield-prediction/${id}/actual-yield`, yieldData);
  },

  // Get yield statistics and insights
  async getStats(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/yield-prediction/stats/insights?${queryParams}`);
  },

  // Get prediction benchmarks
  async getBenchmarks(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/yield-prediction/benchmarks?${queryParams}`);
  }
};