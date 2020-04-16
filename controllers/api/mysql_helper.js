const mysql = require('mysql2');

exports.connection = mysql.createConnection({
    host: 'localhost',
    user: 'mark',
    database: 'inventory',
    password: 'questronix'
});