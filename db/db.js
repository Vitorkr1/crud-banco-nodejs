const sql = require('mysql2')

const pool = sql.createPool({
  connectionLimit: 10,
  host:'localhost',
  user:'root',
  password:'',
  database:'bancobr',
  port:3306

})

module.exports = pool