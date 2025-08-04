const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sree123',         // Your password here (can be empty)
    database: 'organ_finder',
    port: 3306,
});

connection.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err);
    } else {
        console.log(" MySQL Connected!");
    }
});

module.exports = connection;
