const sql = require('mysql2')

const pool = sql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bancobr',
  port: Number(process.env.DB_PORT || 3306)

})

module.exports = pool
