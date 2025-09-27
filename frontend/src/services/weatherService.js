import apiClient from './apiClient';

// Weather service
export const weatherService = {
  // Get current weather and forecast
  async getCurrentWeather(params) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/weather/current?${queryParams}`);
  },

  // Get weather alerts for location
  async getWeatherAlerts(params) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/weather/alerts?${queryParams}`);
  },

  // Get farming recommendations based on weather
  async getWeatherRecommendations(params) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/weather/recommendations?${queryParams}`);
  },

  // Get historical weather data
  async getHistoricalWeather(params) {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/weather/history?${queryParams}`);
  }
};