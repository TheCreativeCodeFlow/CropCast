const MarketPrice = require('../models/MarketPrice');
const axios = require('axios');

// Market service to fetch and update market prices
class MarketService {
  constructor() {
    this.apiKey = process.env.MARKET_DATA_API_KEY;
    // This would be replaced with actual market data API
    this.baseUrl = 'https://api.data.gov.in/resource/market-prices';
  }

  async fetchMarketPricesFromAPI() {
    try {
      // This would fetch from actual government APIs like data.gov.in
      // For now, returning mock data structure
      return this.getMockMarketData();
    } catch (error) {
      console.error('Market API error:', error);
      return this.getMockMarketData();
    }
  }

  getMockMarketData() {
    return [
      {
        commodity: {
          name: 'Wheat',
          nameHi: 'गेहूं',
          category: 'cereal'
        },
        market: {
          name: 'Mumbai APMC',
          nameHi: 'मुंबई एपीएमसी',
          state: 'Maharashtra',
          district: 'Mumbai',
          type: 'APMC'
        },
        price: {
          current: 2850,
          previous: 2800,
          currency: 'INR',
          unit: 'quintal',
          unitHi: 'क्विंटल'
        },
        quality: {
          grade: 'FAQ',
          gradeHi: 'एफएक्यू',
          specifications: 'Fair Average Quality'
        },
        trend: {
          direction: 'up',
          change: 50,
          changePercent: 1.8
        },
        forecast: {
          prediction: 'bullish',
          factors: ['Seasonal demand increase', 'Export opportunities'],
          factorsHi: ['मौसमी मांग में वृद्धि', 'निर्यात के अवसर']
        },
        volume: {
          traded: 1500,
          arrival: 2000
        },
        source: {
          provider: 'Government API',
          reliability: 95
        },
        lastUpdated: new Date(),
        isActive: true
      },
      {
        commodity: {
          name: 'Rice',
          nameHi: 'चावल',
          category: 'cereal'
        },
        market: {
          name: 'Delhi Mandi',
          nameHi: 'दिल्ली मंडी',
          state: 'Delhi',
          district: 'New Delhi',
          type: 'mandi'
        },
        price: {
          current: 3200,
          previous: 3275,
          currency: 'INR',
          unit: 'quintal',
          unitHi: 'क्विंटल'
        },
        quality: {
          grade: 'Grade A',
          gradeHi: 'ग्रेड ए',
          specifications: 'Premium quality'
        },
        trend: {
          direction: 'down',
          change: -75,
          changePercent: -2.3
        },
        forecast: {
          prediction: 'bearish',
          factors: ['Increased supply', 'Storage concerns'],
          factorsHi: ['आपूर्ति में वृद्धि', 'भंडारण की चिंता']
        },
        volume: {
          traded: 2200,
          arrival: 2500
        },
        source: {
          provider: 'Government API',
          reliability: 92
        },
        lastUpdated: new Date(),
        isActive: true
      },
      {
        commodity: {
          name: 'Cotton',
          nameHi: 'कपास',
          category: 'fiber'
        },
        market: {
          name: 'Nagpur APMC',
          nameHi: 'नागपुर एपीएमसी',
          state: 'Maharashtra',
          district: 'Nagpur',
          type: 'APMC'
        },
        price: {
          current: 6800,
          previous: 6680,
          currency: 'INR',
          unit: 'quintal',
          unitHi: 'क्विंटल'
        },
        quality: {
          grade: 'Shankar-6',
          gradeHi: 'शंकर-6',
          specifications: 'Medium quality cotton'
        },
        trend: {
          direction: 'up',
          change: 120,
          changePercent: 1.8
        },
        forecast: {
          prediction: 'bullish',
          factors: ['Strong export demand', 'Textile industry growth'],
          factorsHi: ['मजबूत निर्यात मांग', 'कपड़ा उद्योग की वृद्धि']
        },
        volume: {
          traded: 800,
          arrival: 1000
        },
        source: {
          provider: 'Government API',
          reliability: 88
        },
        lastUpdated: new Date(),
        isActive: true
      },
      {
        commodity: {
          name: 'Onion',
          nameHi: 'प्याज',
          category: 'vegetable'
        },
        market: {
          name: 'Nashik APMC',
          nameHi: 'नासिक एपीएमसी',
          state: 'Maharashtra',
          district: 'Nashik',
          type: 'APMC'
        },
        price: {
          current: 1500,
          previous: 1300,
          currency: 'INR',
          unit: 'quintal',
          unitHi: 'क्विंटल'
        },
        quality: {
          grade: 'Medium',
          gradeHi: 'मध्यम',
          specifications: 'Medium size onions'
        },
        trend: {
          direction: 'up',
          change: 200,
          changePercent: 15.4
        },
        forecast: {
          prediction: 'bullish',
          factors: ['Seasonal demand', 'Festival season'],
          factorsHi: ['मौसमी मांग', 'त्योहारी सीजन']
        },
        volume: {
          traded: 3000,
          arrival: 3500
        },
        source: {
          provider: 'Government API',
          reliability: 90
        },
        lastUpdated: new Date(),
        isActive: true
      },
      {
        commodity: {
          name: 'Tomato',
          nameHi: 'टमाटर',
          category: 'vegetable'
        },
        market: {
          name: 'Pune APMC',
          nameHi: 'पुणे एपीएमसी',
          state: 'Maharashtra',
          district: 'Pune',
          type: 'APMC'
        },
        price: {
          current: 2200,
          previous: 2500,
          currency: 'INR',
          unit: 'quintal',
          unitHi: 'क्विंटल'
        },
        quality: {
          grade: 'Grade I',
          gradeHi: 'ग्रेड I',
          specifications: 'Premium quality tomatoes'
        },
        trend: {
          direction: 'down',
          change: -300,
          changePercent: -12.0
        },
        forecast: {
          prediction: 'bearish',
          factors: ['Increased harvest', 'Weather improvement'],
          factorsHi: ['फसल में वृद्धि', 'मौसम में सुधार']
        },
        volume: {
          traded: 4500,
          arrival: 5000
        },
        source: {
          provider: 'Government API',
          reliability: 85
        },
        lastUpdated: new Date(),
        isActive: true
      },
      {
        commodity: {
          name: 'Sugarcane',
          nameHi: 'गन्ना',
          category: 'cash'
        },
        market: {
          name: 'Lucknow Mandi',
          nameHi: 'लखनऊ मंडी',
          state: 'Uttar Pradesh',
          district: 'Lucknow',
          type: 'mandi'
        },
        price: {
          current: 380,
          previous: 380,
          currency: 'INR',
          unit: 'quintal',
          unitHi: 'क्विंटल'
        },
        quality: {
          grade: 'Medium',
          gradeHi: 'मध्यम',
          specifications: 'Standard quality'
        },
        trend: {
          direction: 'stable',
          change: 0,
          changePercent: 0
        },
        forecast: {
          prediction: 'stable',
          factors: ['Government price support', 'Stable demand'],
          factorsHi: ['सरकारी मूल्य समर्थन', 'स्थिर मांग']
        },
        volume: {
          traded: 10000,
          arrival: 12000
        },
        source: {
          provider: 'Government API',
          reliability: 94
        },
        lastUpdated: new Date(),
        isActive: true
      }
    ];
  }

  async updateMarketPrices() {
    try {
      const marketData = await this.fetchMarketPricesFromAPI();
      let updatedCount = 0;
      let createdCount = 0;

      for (const data of marketData) {
        const existingPrice = await MarketPrice.findOne({
          'commodity.name': data.commodity.name,
          'market.name': data.market.name
        });

        if (existingPrice) {
          // Update existing price
          await MarketPrice.findByIdAndUpdate(existingPrice._id, {
            ...data,
            lastUpdated: new Date()
          });
          updatedCount++;
        } else {
          // Create new price record
          await MarketPrice.create(data);
          createdCount++;
        }
      }

      return {
        success: true,
        message: `Market prices updated successfully`,
        stats: {
          updated: updatedCount,
          created: createdCount,
          total: marketData.length
        }
      };

    } catch (error) {
      console.error('Market price update error:', error);
      throw new Error('Failed to update market prices');
    }
  }

  async getMarketInsights(period = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - period);

      // This would typically analyze price trends and generate insights
      const insights = {
        trending: {
          up: ['Onion', 'Cotton', 'Wheat'],
          down: ['Tomato', 'Rice']
        },
        alerts: [
          {
            type: 'price_surge',
            commodity: 'Onion',
            message: 'Onion prices increased by 15% this week',
            messageHi: 'इस सप्ताह प्याज की कीमतें 15% बढ़ी हैं'
          },
          {
            type: 'price_drop',
            commodity: 'Tomato',
            message: 'Tomato prices dropped by 12% due to increased supply',
            messageHi: 'बढ़ी आपूर्ति के कारण टमाटर की कीमतें 12% गिरीं'
          }
        ],
        recommendations: [
          {
            commodity: 'Cotton',
            action: 'sell',
            reason: 'Strong export demand driving prices up',
            reasonHi: 'निर्यात की मजबूत मांग से कीमतें बढ़ रही हैं'
          },
          {
            commodity: 'Rice',
            action: 'hold',
            reason: 'Prices may stabilize after current decline',
            reasonHi: 'वर्तमान गिरावट के बाद कीमतें स्थिर हो सकती हैं'
          }
        ]
      };

      return insights;

    } catch (error) {
      console.error('Market insights error:', error);
      throw new Error('Failed to generate market insights');
    }
  }

  async getPriceHistory(commodityName, marketName, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // This would fetch historical price data
      // For now, generating mock historical data
      const history = [];
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Generate mock price with some variation
        const basePrice = 2800;
        const variation = (Math.random() - 0.5) * 200;
        const price = Math.round(basePrice + variation);

        history.push({
          date,
          price,
          volume: Math.round(1000 + Math.random() * 500)
        });
      }

      return history;

    } catch (error) {
      console.error('Price history error:', error);
      throw new Error('Failed to fetch price history');
    }
  }
}

// Function to update market prices (called by cron job or manually)
async function updateMarketPrices() {
  const marketService = new MarketService();
  return await marketService.updateMarketPrices();
}

// Function to get market insights
async function getMarketInsights(period) {
  const marketService = new MarketService();
  return await marketService.getMarketInsights(period);
}

// Function to get price history
async function getPriceHistory(commodityName, marketName, days) {
  const marketService = new MarketService();
  return await marketService.getPriceHistory(commodityName, marketName, days);
}

module.exports = {
  updateMarketPrices,
  getMarketInsights,
  getPriceHistory,
  MarketService
};