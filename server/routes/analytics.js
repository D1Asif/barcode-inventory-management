import express from 'express';
import {
  getAnalyticsOverview,
  getCategoryAnalytics
} from '../controllers/analyticsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get analytics data
router.get('/', getAnalyticsOverview);

// Get detailed category analytics
router.get('/categories', getCategoryAnalytics);

export default router; 