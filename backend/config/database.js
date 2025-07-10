// backend/config/database.js

const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool.promise();
// This code creates a MySQL connection pool using the mysql2 library.
// It uses environment variables for configuration, allowing for easy changes without modifying the code.