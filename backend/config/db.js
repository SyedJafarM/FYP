const mysql = require('mysql2');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'furniture_db';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
});

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

const connectDB = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('❌ MySQL Connection Error:', err.message);
      return;
    }
    console.log('✅ Connected to MySQL database!');
    connection.release();
  });
};

module.exports = { sequelize, pool, promisePool, connectDB };
