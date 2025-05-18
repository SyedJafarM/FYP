const { Op, fn, col, literal } = require('sequelize');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const User = require('../models/User');

// Custom threshold for low stock items (optional env config)
const LOW_STOCK_THRESHOLD = parseInt(process.env.LOW_STOCK_THRESHOLD) || 10;

// 📊 Dashboard Summary
const getDashboardSummary = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('total_price');
    res.json({ totalProducts, totalOrders, totalRevenue: totalRevenue || 0 });
  } catch (error) {
    console.error('❌ Error fetching dashboard summary:', error);
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
};

// 📈 Monthly Reports
const getMonthlyReport = async (req, res) => {
  try {
    const reports = await Order.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'month'],
        [fn('SUM', col('total_price')), 'totalRevenue'],
        [fn('COUNT', col('id')), 'orderCount'],
      ],
      group: [fn('DATE_FORMAT', col('created_at'), '%Y-%m')],
      order: [[fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'ASC']],
    });
    res.json(reports);
  } catch (error) {
    console.error('❌ Error fetching monthly report:', error);
    res.status(500).json({ message: 'Failed to fetch monthly report' });
  }
};

// 🏆 Top Products
const getTopProducts = async (req, res) => {
  try {
    const products = await OrderItem.findAll({
      attributes: [
        'product_id',
        [fn('SUM', col('OrderItem.quantity')), 'totalSold']
      ],
      group: ['OrderItem.product_id', 'Product.id'],
      order: [[literal('totalSold'), 'DESC']],
      include: [{ model: Product, attributes: ['name'] }],
      limit: 5
    });
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching top products:', error);
    res.status(500).json({ message: 'Failed to fetch top products' });
  }
};

// 🧑‍💼 Top Customers
const getTopCustomers = async (req, res) => {
  try {
    const customers = await Order.findAll({
      attributes: [
        'email',
        [fn('COUNT', col('id')), 'ordersCount']
      ],
      group: ['email'],
      order: [[literal('ordersCount'), 'DESC']],
      limit: 5
    });
    res.json(customers);
  } catch (error) {
    console.error('❌ Error fetching top customers:', error);
    res.status(500).json({ message: 'Failed to fetch top customers' });
  }
};

// 📦 Low Stock Products
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { quantity: { [Op.lt]: LOW_STOCK_THRESHOLD } },
      attributes: ['id', 'name', 'quantity'],
      order: [['quantity', 'ASC']]
    });
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching low stock products:', error);
    res.status(500).json({ message: 'Failed to fetch low stock products' });
  }
};

// 🛒 Recent Orders (Last 5)
const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'name', 'email', 'total_price', 'status', 'created_at']
    });
    res.json(Array.isArray(orders) ? orders : []);
  } catch (error) {
    console.error('❌ Error fetching recent orders:', error);
    res.status(500).json({ message: 'Failed to fetch recent orders' });
  }
};

// 👤 New Users This Week
const getNewUsersThisWeek = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const count = await User.count({
      where: {
        createdAt: { [Op.gte]: oneWeekAgo }
      }
    });

    res.json({ newUsers: count });
  } catch (error) {
    console.error('❌ Error fetching new users:', error);
    res.status(500).json({ message: 'Failed to fetch new users' });
  }
};

// ✅ Order Fulfillment Rate
const getOrderFulfillmentRate = async (req, res) => {
  try {
    const total = await Order.count();
    const delivered = await Order.count({ where: { status: 'delivered' } });

    const rate = total === 0 ? 0 : Math.round((delivered / total) * 100);

    res.json({ fulfillmentRate: rate });
  } catch (error) {
    console.error('❌ Error calculating fulfillment rate:', error);
    res.status(500).json({ message: 'Failed to calculate fulfillment rate' });
  }
};

// 🚚 Pending vs Delivered Ratio
const getPendingDeliveredRatio = async (req, res) => {
  try {
    const pending = await Order.count({ where: { status: 'pending' } });
    const delivered = await Order.count({ where: { status: 'delivered' } });

    res.json({ pending, delivered });
  } catch (error) {
    console.error('❌ Error calculating order ratio:', error);
    res.status(500).json({ message: 'Failed to fetch order status counts' });
  }
};

module.exports = {
  getMonthlyReport,
  getTopProducts,
  getTopCustomers,
  getDashboardSummary,
  getLowStockProducts,
  getRecentOrders,
  getNewUsersThisWeek,
  getOrderFulfillmentRate,
  getPendingDeliveredRatio
};
