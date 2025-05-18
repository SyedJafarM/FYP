const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  image: { type: DataTypes.STRING }
}, {
  tableName: 'products',
  timestamps: true,           // ✅ Enables created_at
  createdAt: 'created_at',    // ✅ Consistent with orders
  updatedAt: false,
});

module.exports = Product;
