import {
  getAnalyticsOverview,
  getCategoryAnalytics
} from '../services/analyticsService.js';

const getAnalyticsOverviewHandler = async (req, res) => {
  try {
    const result = await getAnalyticsOverview();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
};

const getCategoryAnalyticsHandler = async (req, res) => {
  try {
    const { category } = req.query;
    const result = await getCategoryAnalytics(category);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to fetch category analytics' });
  }
};

export {
  getAnalyticsOverviewHandler as getAnalyticsOverview,
  getCategoryAnalyticsHandler as getCategoryAnalytics
}; 