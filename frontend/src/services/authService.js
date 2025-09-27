import apiClient from './apiClient';

// Authentication service
export const authService = {
  // Register new user
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    if (response.success && response.data.token) {
      apiClient.setToken(response.data.token);
    }
    return response;
  },

  // Login user
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.success && response.data.token) {
      apiClient.setToken(response.data.token);
    }
    return response;
  },

  // Logout user
  async logout() {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      apiClient.setToken(null);
    }
  },

  // Get current user profile
  async getProfile() {
    return apiClient.get('/auth/profile');
  },

  // Update user profile
  async updateProfile(profileData) {
    return apiClient.put('/auth/profile', profileData);
  },

  // Change password
  async changePassword(passwordData) {
    return apiClient.put('/auth/change-password', passwordData);
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiClient.token;
  },

  // Get stored token
  getToken() {
    return apiClient.token;
  }
};