#!/usr/bin/env node

/**
 * Integration Test Script
 * Tests the backend-frontend integration and Gemini API functionality
 */

const axios = require('axios');
const colors = require('colors');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  phone: '+1234567890',
  location: {
    city: 'Delhi',
    state: 'Delhi',
    country: 'India'
  },
  farmDetails: {
    size: 10,
    crops: ['wheat', 'rice'],
    farmType: 'organic'
  }
};

const testTranslations = [
  {
    text: 'The weather is good for planting crops today.',
    targetLanguage: 'hi',
    context: 'weather'
  },
  {
    text: 'Market prices for wheat are rising.',
    targetLanguage: 'es',
    context: 'market'
  },
  {
    text: 'Apply organic fertilizer to improve soil health.',
    targetLanguage: 'fr',
    context: 'soil'
  }
];

class IntegrationTester {
  constructor() {
    this.token = null;
    this.results = {
      auth: { passed: 0, failed: 0 },
      translation: { passed: 0, failed: 0 },
      routes: { passed: 0, failed: 0 },
      overall: { passed: 0, failed: 0 }
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}]`;
    
    switch (type) {
      case 'success':
        console.log(`${prefix} ✅ ${message}`.green);
        break;
      case 'error':
        console.log(`${prefix} ❌ ${message}`.red);
        break;
      case 'warning':
        console.log(`${prefix} ⚠️  ${message}`.yellow);
        break;
      case 'info':
      default:
        console.log(`${prefix} ℹ️  ${message}`.blue);
        break;
    }
  }

  async makeRequest(method, endpoint, data = null, useAuth = false) {
    try {
      const config = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          ...(useAuth && this.token && { Authorization: `Bearer ${this.token}` })
        },
        ...(data && { data })
      };

      const response = await axios(config);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  }

  async testServerHealth() {
    this.log('Testing server health...', 'info');
    
    const result = await this.makeRequest('GET', '/health');
    
    if (result.success) {
      this.log('Server is healthy and responding', 'success');
      this.results.overall.passed++;
      return true;
    } else {
      this.log(`Server health check failed: ${result.error}`, 'error');
      this.results.overall.failed++;
      return false;
    }
  }

  async testUserRegistration() {
    this.log('Testing user registration...', 'info');
    
    const result = await this.makeRequest('POST', '/auth/register', testUser);
    
    if (result.success) {
      this.token = result.data.data.token;
      this.log('User registration successful', 'success');
      this.results.auth.passed++;
      return true;
    } else {
      this.log(`User registration failed: ${result.error}`, 'error');
      this.results.auth.failed++;
      return false;
    }
  }

  async testUserLogin() {
    this.log('Testing user login...', 'info');
    
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };
    
    const result = await this.makeRequest('POST', '/auth/login', loginData);
    
    if (result.success) {
      this.token = result.data.data.token;
      this.log('User login successful', 'success');
      this.results.auth.passed++;
      return true;
    } else {
      this.log(`User login failed: ${result.error}`, 'error');
      this.results.auth.failed++;
      return false;
    }
  }

  async testTranslationRoutes() {
    this.log('Testing translation routes...', 'info');
    
    // Test get supported languages
    const languagesResult = await this.makeRequest('GET', '/translation/languages');
    
    if (languagesResult.success) {
      this.log('Successfully fetched supported languages', 'success');
      this.results.translation.passed++;
    } else {
      this.log(`Failed to fetch supported languages: ${languagesResult.error}`, 'error');
      this.results.translation.failed++;
    }

    // Test language detection (if Gemini API key is set)
    const detectResult = await this.makeRequest('POST', '/translation/detect', {
      text: 'Hello, how are you?'
    }, true);
    
    if (detectResult.success) {
      this.log('Language detection test passed', 'success');
      this.results.translation.passed++;
    } else {
      this.log(`Language detection failed: ${detectResult.error}`, 'warning');
      this.results.translation.failed++;
    }

    // Test translations (will only work with valid Gemini API key)
    for (const testTranslation of testTranslations) {
      const translateResult = await this.makeRequest('POST', '/translation/translate/agricultural', testTranslation, true);
      
      if (translateResult.success) {
        this.log(`Translation test passed: "${testTranslation.text}" -> "${translateResult.data.data.translatedText}"`, 'success');
        this.results.translation.passed++;
      } else {
        this.log(`Translation test failed: ${translateResult.error}`, 'warning');
        this.results.translation.failed++;
      }
    }
  }

  async testOtherRoutes() {
    this.log('Testing other API routes...', 'info');
    
    const routesToTest = [
      { method: 'GET', endpoint: '/weather/current?lat=28.6139&lng=77.2090&city=Delhi&state=Delhi', name: 'Weather API' },
      { method: 'GET', endpoint: '/market/prices?limit=5', name: 'Market Prices API' },
      { method: 'GET', endpoint: '/soil/recommendations', name: 'Soil Recommendations API' },
      { method: 'GET', endpoint: '/auth/profile', name: 'User Profile API', useAuth: true }
    ];

    for (const route of routesToTest) {
      const result = await this.makeRequest(route.method, route.endpoint, null, route.useAuth);
      
      if (result.success) {
        this.log(`${route.name} test passed`, 'success');
        this.results.routes.passed++;
      } else {
        this.log(`${route.name} test failed: ${result.error}`, 'warning');
        this.results.routes.failed++;
      }
    }
  }

  async cleanup() {
    this.log('Cleaning up test data...', 'info');
    
    // In a real scenario, you might want to delete the test user
    // For now, we'll just log out
    if (this.token) {
      await this.makeRequest('POST', '/auth/logout', null, true);
      this.log('User logged out', 'info');
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60).cyan);
    console.log('INTEGRATION TEST REPORT'.cyan.bold);
    console.log('='.repeat(60).cyan);
    
    const categories = ['auth', 'translation', 'routes', 'overall'];
    
    categories.forEach(category => {
      const { passed, failed } = this.results[category];
      const total = passed + failed;
      const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
      
      console.log(`\n${category.toUpperCase().bold}:`);
      console.log(`  Passed: ${passed.toString().green}`);
      console.log(`  Failed: ${failed.toString().red}`);
      console.log(`  Success Rate: ${percentage}%`.cyan);
    });

    const totalPassed = Object.values(this.results).reduce((sum, cat) => sum + cat.passed, 0);
    const totalFailed = Object.values(this.results).reduce((sum, cat) => sum + cat.failed, 0);
    const totalTests = totalPassed + totalFailed;
    const overallPercentage = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0.0';

    console.log('\n' + '-'.repeat(60).cyan);
    console.log(`OVERALL RESULTS:`.bold);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed.toString().green}`);
    console.log(`Failed: ${totalFailed.toString().red}`);
    console.log(`Success Rate: ${overallPercentage}%`.cyan.bold);
    console.log('='.repeat(60).cyan + '\n');

    // Recommendations
    if (this.results.translation.failed > 0) {
      console.log('⚠️  Translation tests failed. Make sure to:'.yellow);
      console.log('   1. Set a valid GEMINI_API_KEY in your .env file'.yellow);
      console.log('   2. Install the @google/generative-ai package'.yellow);
      console.log('   3. Ensure your Gemini API key has the correct permissions\n'.yellow);
    }

    if (this.results.routes.failed > 0) {
      console.log('⚠️  Some route tests failed. This might indicate:'.yellow);
      console.log('   1. Missing environment variables for external APIs'.yellow);
      console.log('   2. Database connection issues'.yellow);
      console.log('   3. External services not available during testing\n'.yellow);
    }
  }

  async run() {
    console.log('🚀 Starting CropCast Integration Tests...\n'.bold.green);
    
    try {
      // Test server health first
      const serverHealthy = await this.testServerHealth();
      if (!serverHealthy) {
        throw new Error('Server is not responding. Please ensure the backend is running on port 5000.');
      }

      // Test authentication
      await this.testUserRegistration();
      await this.testUserLogin();

      // Test translation functionality
      await this.testTranslationRoutes();

      // Test other routes
      await this.testOtherRoutes();

      // Cleanup
      await this.cleanup();

    } catch (error) {
      this.log(`Test execution failed: ${error.message}`, 'error');
    } finally {
      // Generate report
      this.generateReport();
    }
  }
}

// Run the tests
if (require.main === module) {
  const tester = new IntegrationTester();
  tester.run().catch(console.error);
}

module.exports = IntegrationTester;