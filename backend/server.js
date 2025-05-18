const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { User, Product, Category, Order, OrderItem, Cart } = require('./models');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const adminRoutes = require('./routes/adminRoutes'); // ✅ Admin routes

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET is not defined');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

connectDB();

(async () => {
  try {
    const syncOptions = { alter: false };
    await User.sync(syncOptions);
    await Product.sync(syncOptions);
    await Category.sync(syncOptions);
    await Order.sync(syncOptions);
    await OrderItem.sync(syncOptions);
    await Cart.sync(syncOptions);
    console.log('✅ Models synced successfully');
  } catch (error) {
    console.error('❌ Sync error:', error);
    process.exit(1);
  }
})();

// ✅ Register routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/admin', adminRoutes); // ✅ Admin routes

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', time: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
