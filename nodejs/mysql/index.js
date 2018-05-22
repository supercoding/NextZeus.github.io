// docker run -p 3306:3306 --name mysql-server -e MYSQL_ROOT_PASSWORD=b3RmELKOvCUrAdxIg0GEmugc3SY -e MYSQL_ROOT_HOST=% -d mysql/mysql-server:5.7.22

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'b3RmELKOvCUrAdxIg0GEmugc3SY',
  database : ''
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();