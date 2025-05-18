const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
}, {
  tableName: 'users',
  timestamps: true,          // ✅ Enables createdAt tracking
  createdAt: 'createdAt',    // ✅ Uses standard naming
  updatedAt: false,          // ❌ Disable updatedAt if not used
});

module.exports = User;
