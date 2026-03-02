require('dotenv').config();
const mysql = require('mysql2/promise');

// MySQL configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'user_registration_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
let pool = null;

async function getMySQLConnection() {
    try {
        if (!pool) {
            pool = mysql.createPool(dbConfig);
        }
        return await pool.getConnection();
    } catch (error) {
        console.error('MySQL Connection failed:', error.message);
        console.log('⚠️  MySQL not configured - signup/login will not work');
        return null;
    }
}

async function closeMySQLConnection(connection) {
    if (connection) {
        connection.release();
    }
}

module.exports = {
    getMySQLConnection,
    closeMySQLConnection
};
