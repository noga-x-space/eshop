const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.DBPORT,
});

module.exports = pool;
