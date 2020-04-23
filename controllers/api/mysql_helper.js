const mysql = require('mysql2');

const db_config = {
    host: 'localhost',
    user: 'mark',
    password: 'questronix',
    database: 'inventory',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
};

exports.connection = mysql.createPool(db_config);
