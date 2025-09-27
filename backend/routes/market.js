const express = require('express');
const MarketPrice = require('../models/MarketPrice');
const auth = require('../middleware/auth');
const { updateMarketPrices } = require('../services/marketService');
const router = express.Router();

// Get current market prices
router.get('/prices', async (req, res) => {
  try {
    const { 
      category, 
      market, 
      state, 
      commodity, 
      limit = 50, 
      page = 1,
      sortBy = 'lastUpdated',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (category && category !== 'all') {
      query['commodity.category'] = category;
    }
    
    if (market && market !== 'all') {
      query['market.name'] = { $regex: market, $options: 'i' };
    }
    
    if (state) {
      query['market.state'] = { $regex: state, $options: 'i' };
    }
    
    if (commodity) {
      query['commodity.name'] = { $regex: commodity, $options: 'i' };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [prices, total] = await Promise.all([
      MarketPrice.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      MarketPrice.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        prices,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          hasNext: skip + prices.length < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Market prices fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market prices',
      error: error.message
    });
  }
});

// Get price trends for a specific commodity
router.get('/trends/:commodityId', async (req, res) => {
  try {
    const { commodityId } = req.params;
    const { market, days = 30 } = req.query;

    const query = {
      'commodity.name': { $regex: commodityId, $options: 'i' },
      lastUpdated: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
    };

    if (market) {
      query['market.name'] = { $regex: market, $options: 'i' };
    }

    const trends = await MarketPrice.find(query)
      .sort({ lastUpdated: 1 })
      .select('price.current price.previous lastUpdated market.name trend');

    res.json({
      success: true,
      data: trends
    });

  } catch (error) {
    console.error('Price trends fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch price trends',
      error: error.message
    });
  }
});

// Get market analysis and insights
router.get('/analysis', async (req, res) => {
  try {
    const { category, state } = req.query;

    // Build match stage
    const matchStage = { isActive: true };
    if (category && category !== 'all') {
      matchStage['commodity.category'] = category;
    }
    if (state) {
      matchStage['market.state'] = { $regex: state, $options: 'i' };
    }

    const analysis = await MarketPrice.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalCommodities: { $sum: 1 },
          averagePrice: { $avg: '$price.current' },
          maxPrice: { $max: '$price.current' },
          minPrice: { $min: '$price.current' },
          priceIncreases: {
            $sum: { $cond: [{ $gt: ['$trend.changePercent', 0] }, 1, 0] }
          },
          priceDecreases: {
            $sum: { $cond: [{ $lt: ['$trend.changePercent', 0] }, 1, 0] }
          },
          stablePrices: {
            $sum: { $cond: [{ $eq: ['$trend.changePercent', 0] }, 1, 0] }
          }
        }
      }
    ]);

    // Get top gainers and losers
    const topGainers = await MarketPrice.find(matchStage)
      .sort({ 'trend.changePercent': -1 })
      .limit(5)
      .select('commodity.name commodity.nameHi market.name price.current trend.changePercent');

    const topLosers = await MarketPrice.find(matchStage)
      .sort({ 'trend.changePercent': 1 })
      .limit(5)
      .select('commodity.name commodity.nameHi market.name price.current trend.changePercent');

    // Get category-wise analysis
    const categoryAnalysis = await MarketPrice.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$commodity.category',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price.current' },
          averageChange: { $avg: '$trend.changePercent' }
        }
      },
      { $sort: { averageChange: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: analysis[0] || {
          totalCommodities: 0,
          averagePrice: 0,
          maxPrice: 0,
          minPrice: 0,
          priceIncreases: 0,
          priceDecreases: 0,
          stablePrices: 0
        },
        topGainers,
        topLosers,
        categoryAnalysis
      }
    });

  } catch (error) {
    console.error('Market analysis fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market analysis',
      error: error.message
    });
  }
});

// Set price alerts (requires authentication)
router.post('/alerts', auth, async (req, res) => {
  try {
    const { commodityName, marketName, targetPrice, alertType } = req.body;

    // This would typically be stored in a separate PriceAlert model
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Price alert set successfully',
      data: {
        commodityName,
        marketName,
        targetPrice,
        alertType,
        userId: req.user.id
      }
    });

  } catch (error) {
    console.error('Price alert setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set price alert',
      error: error.message
    });
  }
});

// Get available markets
router.get('/markets', async (req, res) => {
  try {
    const { state } = req.query;

    const query = { isActive: true };
    if (state) {
      query['market.state'] = { $regex: state, $options: 'i' };
    }

    const markets = await MarketPrice.distinct('market', query);

    res.json({
      success: true,
      data: markets
    });

  } catch (error) {
    console.error('Markets fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch markets',
      error: error.message
    });
  }
});

// Get available commodities
router.get('/commodities', async (req, res) => {
  try {
    const { category } = req.query;

    const query = { isActive: true };
    if (category && category !== 'all') {
      query['commodity.category'] = category;
    }

    const commodities = await MarketPrice.distinct('commodity', query);

    res.json({
      success: true,
      data: commodities
    });

  } catch (error) {
    console.error('Commodities fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch commodities',
      error: error.message
    });
  }
});

// Admin route to update market prices (requires admin auth)
router.post('/update', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Update market prices from external sources
    const updateResult = await updateMarketPrices();

    res.json({
      success: true,
      message: 'Market prices updated successfully',
      data: updateResult
    });

  } catch (error) {
    console.error('Market prices update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update market prices',
      error: error.message
    });
  }
});

module.exports = router;