const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Product = require('./Product');

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
}, {
  tableName: 'cart_items',
  timestamps: true
});

Cart.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = Cart;
