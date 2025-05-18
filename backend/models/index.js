const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Product = require('./Product');
const User = require('./User');
const Cart = require('./Cart');
const Category = require('./Category');

// Relations
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'OrderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = { Order, OrderItem, Product, User, Cart, Category };
