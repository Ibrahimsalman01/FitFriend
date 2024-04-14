const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.host,
  database: process.env.database,
  user: process.env.user,
  password: process.env.password,
  port: process.env.port 
});

module.exports = pool;