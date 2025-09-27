import apiClient from './apiClient';

// Market prices service
export const marketService = {
  // Get current market prices
  async getMarketPrices(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/market/prices?${queryParams}`);
  },

  // Get price trends for specific commodity
  async getPriceTrends(commodityId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/market/trends/${commodityId}?${queryParams}`);
  },

  // Get market analysis and insights
  async getMarketAnalysis(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/market/analysis?${queryParams}`);
  },

  // Set price alert
  async setPriceAlert(alertData) {
    return apiClient.post('/market/alerts', alertData);
  },

  // Get available markets
  async getMarkets(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/market/markets?${queryParams}`);
  },

  // Get available commodities
  async getCommodities(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/market/commodities?${queryParams}`);
  }
};