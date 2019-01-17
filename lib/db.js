var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'thtm1423',
  database: 'nodejs'
});
connection.connect();
module.exports = connection;
