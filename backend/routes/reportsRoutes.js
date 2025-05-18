const express = require('express');
const router = express.Router();

const {
  getMonthlyReport,
  getTopProducts,
  getTopCustomers,
  getDashboardSummary,
  getLowStockProducts,
  getRecentOrders,
  getNewUsersThisWeek,
  getOrderFulfillmentRate,
  getPendingDeliveredRatio
} = require('../controllers/reportController');

// ✅ Reports routes
router.get('/monthly', getMonthlyReport);
router.get('/top-products', getTopProducts);
router.get('/top-customers', getTopCustomers);
router.get('/summary', getDashboardSummary);

// ✅ New dashboard metrics
router.get('/low-stock', getLowStockProducts);
router.get('/recent-orders', getRecentOrders);
router.get('/new-users-week', getNewUsersThisWeek);
router.get('/fulfillment-rate', getOrderFulfillmentRate);
router.get('/status-ratio', getPendingDeliveredRatio);

module.exports = router;
